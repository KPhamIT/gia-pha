import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResendVerificationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(254)
  login: string;
}
