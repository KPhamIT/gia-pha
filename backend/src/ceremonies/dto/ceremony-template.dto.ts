import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCeremonyTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateCeremonyTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
