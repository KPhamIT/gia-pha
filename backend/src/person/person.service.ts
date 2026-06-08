import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';

@Injectable()
export class PersonService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDefaultOrganization() {
    const defaultName = 'Family Tree';
    const existing = await this.prisma.organization.findFirst({
      where: { name: defaultName },
    });
    if (existing) {
      return existing;
    }
    return this.prisma.organization.create({ data: { name: defaultName } });
  }

  async create(createPersonDto: CreatePersonDto) {
    const organization =
      createPersonDto.organizationId || createPersonDto.organizationId === 0
        ? await this.prisma.organization.findUnique({
            where: { id: createPersonDto.organizationId },
          })
        : await this.getDefaultOrganization();

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
      avatar: createPersonDto.avatar,
      generation: Number.isNaN(generation) ? undefined : generation,
      branch: createPersonDto.branch,
      organizationId:
        organization?.id ?? (await this.getDefaultOrganization()).id,
      userId: createPersonDto.userId,
    };

    return this.prisma.person.create({ data });
  }

  async findAll() {
    return this.prisma.person.findMany({ orderBy: { fullName: 'asc' } });
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

  async update(id: number, updatePersonDto: UpdatePersonDto) {
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
        generation: Number.isNaN(generation) ? undefined : generation,
        branch: updatePersonDto.branch,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.person.delete({ where: { id } });
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
}
