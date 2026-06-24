import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, type User } from '../../generated/prisma/client.js';
import { adminOrganizationId, isSystem } from '../auth/org-access.js';
import { assertPersonOrgAccess } from '../auth/person-org-access.js';
import { OrganizationService } from '../organization/organization.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { UpdatePersonDetailDto } from './dto/update-person-detail.dto.js';
import {
  formatPersonEditorName,
  recordPersonEdit,
} from './person-edit-audit.js';

const editorSelect = { id: true, username: true, email: true } as const;

const personDetailInclude = {
  biography: true,
  graveInfo: true,
  lastEditedBy: { select: editorSelect },
  editLogs: {
    take: 20,
    orderBy: { editedAt: 'desc' as const },
    include: { user: { select: editorSelect } },
  },
};

@Injectable()
export class PersonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
  ) {}

  async create(createPersonDto: CreatePersonDto, user: User) {
    const organizationId = await this.resolveCreateOrganizationId(
      createPersonDto.organizationId,
      user,
    );

    const generation =
      createPersonDto.generation != null
        ? Number(createPersonDto.generation)
        : undefined;

    const data = {
      fullName: createPersonDto.fullName,
      gender: createPersonDto.gender,
      birthDate: createPersonDto.birthDate
        ? new Date(createPersonDto.birthDate)
        : undefined,
      deathDate: createPersonDto.deathDate
        ? new Date(createPersonDto.deathDate)
        : undefined,
      deathLunarDay: createPersonDto.deathLunarDay,
      deathLunarMonth: createPersonDto.deathLunarMonth,
      deceased: createPersonDto.deceased ?? false,
      avatar: createPersonDto.avatar,
      generation: Number.isNaN(generation) ? undefined : generation,
      branch: createPersonDto.branch,
      birthPlace: createPersonDto.birthPlace,
      currentLocation: createPersonDto.currentLocation,
      education: createPersonDto.education,
      occupation: createPersonDto.occupation,
      religion: createPersonDto.religion,
      ethnicity: createPersonDto.ethnicity,
      achievements: createPersonDto.achievements,
      organizationId,
      userId: createPersonDto.userId,
    };

    return this.prisma.$transaction(async (tx) => {
      const person = await tx.person.create({ data });
      await recordPersonEdit(tx, person.id, user.id);
      return person;
    });
  }

  async findAll() {
    return this.prisma.person.findMany({ orderBy: { fullName: 'asc' } });
  }

  async findAllDetails() {
    const [persons, relationships] = await Promise.all([
      this.prisma.person.findMany({
        include: { biography: true, graveInfo: true },
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.relationship.findMany({ include: { from: true, to: true } }),
    ]);

    return persons.map((person) => ({
      person,
      relationships: relationships.filter(
        (r) => r.fromId === person.id || r.toId === person.id,
      ),
    }));
  }

  async findOne(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }
    return person;
  }

  async findByUserId(userId: number) {
    return this.prisma.person.findUnique({ where: { userId } });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, user: User) {
    const person = await this.findOne(id);
    assertPersonOrgAccess(user, person);

    const generation =
      updatePersonDto.generation != null
        ? Number(updatePersonDto.generation)
        : undefined;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.person.update({
        where: { id },
        data: {
          ...updatePersonDto,
          birthDate: updatePersonDto.birthDate
            ? new Date(updatePersonDto.birthDate)
            : updatePersonDto.birthDate,
          deathDate: updatePersonDto.deathDate
            ? new Date(updatePersonDto.deathDate)
            : updatePersonDto.deathDate,
          generation: Number.isNaN(generation) ? undefined : generation,
          branch: updatePersonDto.branch,
        },
      });
      await recordPersonEdit(tx, id, user.id);
      return updated;
    });
  }

  async getPersonDetail(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: personDetailInclude,
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const relationships = await this.prisma.relationship.findMany({
      where: { OR: [{ fromId: id }, { toId: id }] },
      include: { from: true, to: true },
    });

    const { editLogs, lastEditedBy, ...personData } = person;

    return {
      person: {
        ...personData,
        lastEditedBy: lastEditedBy
          ? {
              id: lastEditedBy.id,
              displayName: formatPersonEditorName(lastEditedBy),
            }
          : null,
      },
      relationships,
      editHistory: editLogs.map((log) => ({
        userId: log.userId,
        displayName: formatPersonEditorName(log.user),
        editedAt: log.editedAt,
      })),
    };
  }

  async updatePersonDetail(id: number, dto: UpdatePersonDetailDto, user: User) {
    const person = await this.findOne(id);
    assertPersonOrgAccess(user, person);

    const { biography, graveInfo, ...personFields } = dto;

    const generation =
      personFields.generation != null
        ? Number(personFields.generation)
        : undefined;

    const clearingDeceased = dto.deceased === false;

    await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id },
        data: {
          ...personFields,
          birthDate: personFields.birthDate
            ? new Date(personFields.birthDate)
            : personFields.birthDate,
          deathDate: clearingDeceased
            ? null
            : personFields.deathDate
              ? new Date(personFields.deathDate)
              : personFields.deathDate,
          deathLunarDay: clearingDeceased ? null : personFields.deathLunarDay,
          deathLunarMonth: clearingDeceased ? null : personFields.deathLunarMonth,
          generation: Number.isNaN(generation) ? undefined : generation,
        },
      });

      if (biography !== undefined) {
        await tx.biography.upsert({
          where: { personId: id },
          create: { personId: id, content: biography },
          update: { content: biography },
        });
      }

      if (clearingDeceased) {
        await tx.graveInfo.deleteMany({ where: { personId: id } });
      } else if (graveInfo !== undefined) {
        await tx.graveInfo.upsert({
          where: { personId: id },
          create: { personId: id, ...graveInfo },
          update: graveInfo,
        });
      }

      await recordPersonEdit(tx, id, user.id);
    });

    return this.getPersonDetail(id);
  }

  async remove(id: number, user: User) {
    const person = await this.findOne(id);
    assertPersonOrgAccess(user, person);

    await this.prisma.relationship.deleteMany({
      where: { OR: [{ fromId: id }, { toId: id }] },
    });
    return this.prisma.person.delete({ where: { id } });
  }

  async getDefaultFamilyGraphForUser(
    user?: User | null,
    requestedOrgId?: number,
    orgAccessToken?: string,
  ) {
    const organizationId =
      await this.organizationService.resolveDefaultOrganizationId(
        user,
        requestedOrgId,
        orgAccessToken,
      );
    const persons = await this.prisma.person.findMany({
      where: { organizationId },
      orderBy: { fullName: 'asc' },
    });
    const root =
      persons.find((person) => person.generation === 0) ?? persons[0];
    if (!root) {
      throw new NotFoundException('No persons found for organization');
    }
    return this.getFamilyGraph(root.id);
  }

  async getDefaultFamilyGraph() {
    return this.getDefaultFamilyGraphForUser();
  }

  async getFamilyGraph(rootId: number) {
    const root = await this.findOne(rootId);
    const persons = await this.prisma.person.findMany({
      where: { organizationId: root.organizationId },
      orderBy: { fullName: 'asc' },
    });
    const relationships = await this.prisma.relationship.findMany({
      where: {
        OR: [
          { from: { organizationId: root.organizationId } },
          { to: { organizationId: root.organizationId } },
        ],
      },
      include: { from: true, to: true },
    });

    const filteredRelationships = relationships.filter(
      (relationship) => relationship.fromId !== relationship.toId,
    );

    return { root, persons, relationships: filteredRelationships };
  }

  private async resolveCreateOrganizationId(
    requestedOrgId: number | undefined,
    user: User,
  ): Promise<number> {
    if (user.role === UserRole.ADMIN) {
      return adminOrganizationId(user);
    }
    if (!isSystem(user)) {
      throw new ForbiddenException('Cannot create person');
    }
    return this.organizationService.resolveDefaultOrganizationId(
      user,
      requestedOrgId,
    );
  }
}
