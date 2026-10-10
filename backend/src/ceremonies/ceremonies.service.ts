import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '../../generated/prisma/client.js';
import { assertOrgMemberAccess } from '../auth/org-access.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  DEFAULT_CEREMONY_TEMPLATE,
  buildCeremonyVars,
  buildPlaceholderCeremonyVars,
  renderCeremonyTemplate,
} from './ceremony-template.js';
import {
  normalizeCeremonyHtml,
  resolveCeremonyPrintTitle,
} from './ceremony-html.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';
import {
  createCeremonyShareToken,
  verifyCeremonyShareToken,
} from './ceremony-share-token.js';

type WorshipperPerson = {
  fullName: string;
  currentLocation: string | null;
  birthPlace: string | null;
} | null;

@Injectable()
export class CeremoniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ceremonyTemplates: CeremonyTemplatesService,
    private readonly config: ConfigService,
  ) {}

  async createShareToken(user: User, personId: number) {
    await this.assertPersonInOrg(user, personId);
    const token = createCeremonyShareToken(personId, this.shareSecret());
    return { token, personId };
  }

  async renderCeremonyHtmlByShareToken(token: string) {
    const personId = verifyCeremonyShareToken(token, this.shareSecret());
    if (personId == null) {
      throw new UnauthorizedException('Invalid or expired share link');
    }
    return this.renderCeremonyHtmlForPerson(personId, null);
  }

  async renderTemplatePreviewHtml(user: User, templateId: number) {
    const template = await this.ceremonyTemplates.findOne(user, templateId);
    const organization = await this.prisma.organization.findUnique({
      where: { id: template.organizationId },
      select: { id: true, name: true },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    const worshipper = await this.prisma.person.findUnique({
      where: { userId: user.id },
      select: { fullName: true, currentLocation: true, birthPlace: true },
    });
    const vars = buildPlaceholderCeremonyVars(organization.name, worshipper);
    const rendered = renderCeremonyTemplate(template.content, vars);
    const html = normalizeCeremonyHtml(rendered, {
      title: resolveCeremonyPrintTitle(template),
    });

    return {
      personId: null,
      fullName: '',
      organizationId: organization.id,
      html,
    };
  }

  async renderCeremonyHtml(user: User, personId: number, templateId?: number) {
    await this.assertPersonInOrg(user, personId);
    const worshipper = await this.prisma.person.findUnique({
      where: { userId: user.id },
      select: { fullName: true, currentLocation: true, birthPlace: true },
    });
    return this.renderCeremonyHtmlForPerson(
      personId,
      worshipper,
      user,
      templateId,
    );
  }

  private async renderCeremonyHtmlForPerson(
    personId: number,
    worshipper: WorshipperPerson,
    user?: User,
    templateId?: number,
  ) {
    const person = await this.loadPersonOrThrow(personId);
    const template = await this.resolveTemplate(
      person.organizationId,
      user,
      templateId,
    );
    const vars = buildCeremonyVars(person, worshipper);
    const rendered = renderCeremonyTemplate(template.content, vars);
    const html = normalizeCeremonyHtml(rendered, {
      title: resolveCeremonyPrintTitle(template),
    });

    return {
      personId: person.id,
      fullName: person.fullName,
      organizationId: person.organizationId,
      html,
    };
  }

  private async assertPersonInOrg(user: User, personId: number) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      select: {
        organizationId: true,
        deathLunarDay: true,
        deathLunarMonth: true,
      },
    });
    if (!person) throw new NotFoundException('Person not found');
    assertOrgMemberAccess(user, person.organizationId);
    if (person.deathLunarDay == null || person.deathLunarMonth == null) {
      throw new NotFoundException('Person has no lunar death date configured');
    }
  }

  private async loadPersonOrThrow(personId: number) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: {
        organization: { select: { id: true, name: true } },
        graveInfo: true,
      },
    });
    if (!person) throw new NotFoundException('Person not found');
    if (person.deathLunarDay == null || person.deathLunarMonth == null) {
      throw new NotFoundException('Person has no lunar death date configured');
    }
    return person;
  }

  private async resolveTemplate(
    organizationId: number,
    user: User | undefined,
    templateId?: number,
  ): Promise<{ content: string; name?: string; printTitle?: string | null }> {
    if (templateId != null) {
      if (!user)
        throw new ForbiddenException('Template selection requires login');
      const template = await this.ceremonyTemplates.findOne(user, templateId);
      this.ceremonyTemplates.assertTemplateUsableForOrganization(
        template,
        organizationId,
      );
      return template;
    }
    return (
      (await this.ceremonyTemplates.resolveDefaultTemplate(organizationId)) ?? {
        content: DEFAULT_CEREMONY_TEMPLATE,
      }
    );
  }

  private shareSecret(): string {
    return this.config.get<string>('JWT_SECRET', 'change-me');
  }
}
