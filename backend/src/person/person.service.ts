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

    return this.prisma.person.create({ data });
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

    return this.prisma.person.update({
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
  }

  async getPersonDetail(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: { biography: true, graveInfo: true },
    });
    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const relationships = await this.prisma.relationship.findMany({
      where: { OR: [{ fromId: id }, { toId: id }] },
      include: { from: true, to: true },
    });

    return { person, relationships };
  }

  async updatePersonDetail(id: number, dto: UpdatePersonDetailDto, user: User) {
    const person = await this.findOne(id);
    assertPersonOrgAccess(user, person);

    const { biography, graveInfo, ...personFields } = dto;

    const generation =
      personFields.generation != null
        ? Number(personFields.generation)
        : undefined;

    await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id },
        data: {
          ...personFields,
          birthDate: personFields.birthDate
            ? new Date(personFields.birthDate)
            : personFields.birthDate,
          deathDate: personFields.deathDate
            ? new Date(personFields.deathDate)
            : personFields.deathDate,
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

      if (graveInfo !== undefined) {
        await tx.graveInfo.upsert({
          where: { personId: id },
          create: { personId: id, ...graveInfo },
          update: graveInfo,
        });
      }
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
  ) {
    const organizationId =
      await this.organizationService.resolveDefaultOrganizationId(
        user,
        requestedOrgId,
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
