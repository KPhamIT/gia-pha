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
import { OrganizationService } from '../organization/organization.service.js';
import {
  DEFAULT_CEREMONY_TEMPLATE,
  buildCeremonyVars,
  renderCeremonyTemplate,
} from './ceremony-template.js';
import { normalizeCeremonyHtml } from './ceremony-html.js';
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
    private readonly organizationService: OrganizationService,
  ) {}

  /** Bài cúng mẫu của org demo: người đã mất đầu tiên + mẫu mặc định. Công khai. */
  async renderDemoCeremony() {
    const personId = await this.resolveDemoCeremonyPersonId();
    return this.renderCeremonyHtmlForPerson(personId, null);
  }

  /** Share token công khai cho bài cúng demo (org demo là dữ liệu công khai). */
  async createDemoShareToken() {
    const personId = await this.resolveDemoCeremonyPersonId();
    const token = createCeremonyShareToken(personId, this.shareSecret());
    return { token, personId };
  }

  private async resolveDemoCeremonyPersonId(): Promise<number> {
    const orgId = await this.organizationService.getDemoOrganizationId();
    if (orgId == null) {
      throw new NotFoundException('Demo organization is not configured');
    }
    const person = await this.prisma.person.findFirst({
      where: {
        organizationId: orgId,
        deathLunarDay: { not: null },
        deathLunarMonth: { not: null },
      },
      orderBy: [{ generation: 'asc' }, { fullName: 'asc' }],
      select: { id: true },
    });
    if (!person) {
      throw new NotFoundException('No ceremony demo data found');
    }
    return person.id;
  }

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
    const templateContent = await this.resolveTemplateContent(
      person.organizationId,
      user,
      templateId,
    );
    const vars = buildCeremonyVars(person, worshipper);
    const rendered = renderCeremonyTemplate(templateContent, vars);
    const html = normalizeCeremonyHtml(rendered);

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

  private async resolveTemplateContent(
    organizationId: number,
    user: User | undefined,
    templateId?: number,
  ) {
    if (templateId != null) {
      if (!user)
        throw new ForbiddenException('Template selection requires login');
      const template = await this.ceremonyTemplates.findOne(user, templateId);
      if (template.organizationId !== organizationId) {
        throw new ForbiddenException(
          'Template does not belong to the person organization',
        );
      }
      return template.content;
    }
    return (
      (await this.ceremonyTemplates.resolveTemplateContent(organizationId)) ??
      DEFAULT_CEREMONY_TEMPLATE
    );
  }

  private shareSecret(): string {
    return this.config.get<string>('JWT_SECRET', 'change-me');
  }
}
