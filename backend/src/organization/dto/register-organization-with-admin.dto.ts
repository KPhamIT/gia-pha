import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterOrganizationWithAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(254)
  email: string;
}
