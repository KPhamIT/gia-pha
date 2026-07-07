import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CONTACT_SUBJECT_OPTIONS } from '../contact-subjects.js';

export class SubmitContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsIn([...CONTACT_SUBJECT_OPTIONS])
  subject: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
}
