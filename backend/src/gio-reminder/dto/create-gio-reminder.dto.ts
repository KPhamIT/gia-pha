import {
  IsEmail,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGioReminderDto {
  /** Người được nhắc giỗ, vd. "Ông nội", "Bà ngoại Nguyễn Thị Hoa". */
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  deceasedName: string;

  @IsInt()
  @Min(1)
  @Max(12)
  lunarMonth: number;

  @IsInt()
  @Min(1)
  @Max(30)
  lunarDay: number;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(254)
  email: string;
}
