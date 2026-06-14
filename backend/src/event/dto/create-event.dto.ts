import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EventType } from '../../../generated/prisma/client.js';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  amountPerPerson?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  organizationId?: number;
}
