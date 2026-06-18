import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { assertOrgMemberAccess } from '../auth/org-access.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  DEFAULT_CEREMONY_TEMPLATE,
  buildCeremonyVars,
  renderCeremonyTemplate,
} from './ceremony-template.js';
import { normalizeCeremonyHtml } from './ceremony-html.js';
import { CeremonyTemplatesService } from './ceremony-templates.service.js';

@Injectable()
export class CeremoniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ceremonyTemplates: CeremonyTemplatesService,
  ) {}

  async renderCeremonyHtml(user: User, personId: number) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: {
        organization: { select: { id: true, name: true } },
        graveInfo: true,
      },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    assertOrgMemberAccess(user, person.organizationId);

    if (person.deathLunarDay == null || person.deathLunarMonth == null) {
      throw new NotFoundException('Person has no lunar death date configured');
    }

    const worshipper = await this.prisma.person.findUnique({
      where: { userId: user.id },
      select: { fullName: true, currentLocation: true, birthPlace: true },
    });

    const templateContent =
      (await this.ceremonyTemplates.resolveTemplateContent(person.organizationId)) ??
      DEFAULT_CEREMONY_TEMPLATE;

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
}
