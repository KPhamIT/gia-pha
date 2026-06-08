import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRelationshipDto } from './dto/create-relationship.dto.js';
import { RelationshipType } from '../../generated/prisma/client.js';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRelationshipDto) {
    if (dto.fromId === dto.toId) {
      throw new BadRequestException('Cannot create relationship to self');
    }

    const fromPerson = await this.prisma.person.findUnique({
      where: { id: dto.fromId },
    });
    const toPerson = await this.prisma.person.findUnique({
      where: { id: dto.toId },
    });

    if (!fromPerson || !toPerson) {
      throw new NotFoundException('Person not found');
    }

    const existing = await this.prisma.relationship.findFirst({
      where: {
        fromId: dto.fromId,
        toId: dto.toId,
        type: dto.type,
      },
    });

    if (existing) {
      return existing;
    }
    

    console.log('Creating relationship', { fromId: dto.fromId, toId: dto.toId, type: dto.type });

    const relationship = await this.prisma.relationship.create({
      data: {
        fromId: dto.fromId,
        toId: dto.toId,
        type: dto.type,
      },
    });

    console.log('Created relationship', relationship);


    // const reverseType = this.getReverseType(dto.type, fromPerson, toPerson);

    // if (reverseType) {
    //   const reverseExist = await this.prisma.relationship.findFirst({
    //     where: {
    //       fromId: dto.toId,
    //       toId: dto.fromId,
    //       type: reverseType,
    //     },
    //   });

    //   if (!reverseExist) {
    //     await this.prisma.relationship.create({
    //       data: {
    //         fromId: dto.toId,
    //         toId: dto.fromId,
    //         type: reverseType,
    //       },
    //     });
    //   }
    // }

    return relationship;
  }

  async remove(id: number) {
    const relationship = await this.prisma.relationship.findUnique({
      where: { id },
      include: { from: true, to: true },
    });

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    const reverseType = this.getReverseType(
      relationship.type,
      relationship.from,
      relationship.to,
    );

    await this.prisma.relationship.delete({ where: { id } });

    if (reverseType) {
      await this.prisma.relationship.deleteMany({
        where: {
          fromId: relationship.toId,
          toId: relationship.fromId,
          type: reverseType,
        },
      });
    }

    return { id };
  }

  async findAll() {
    return this.prisma.relationship.findMany({
      include: { from: true, to: true },
    });
  }

  private getReverseType(
    type: RelationshipType,
    fromPerson: { gender?: string | null },
    toPerson: { gender?: string | null },
  ): RelationshipType | null {
    if (type === RelationshipType.SPOUSE) {
      return RelationshipType.SPOUSE;
    }

    if (type === RelationshipType.FATHER || type === RelationshipType.MOTHER) {
      return RelationshipType.CHILD;
    }

    if (type === RelationshipType.CHILD) {
      if (fromPerson.gender === 'female') {
        return RelationshipType.MOTHER;
      }
      if (fromPerson.gender === 'male') {
        return RelationshipType.FATHER;
      }
      return null;
    }

    return null;
  }
}
