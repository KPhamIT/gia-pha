import { IsEnum, IsInt, Min } from 'class-validator';
import { RelationshipType } from '../../../generated/prisma/client.js';

export class CreateRelationshipDto {
  @IsInt()
  @Min(1)
  fromId: number;

  @IsInt()
  @Min(1)
  toId: number;

  @IsEnum(RelationshipType)
  type: RelationshipType;
}
