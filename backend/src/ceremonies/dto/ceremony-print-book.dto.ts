import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/** Dựng nội dung sách văn khấn in sẵn (công cụ in sách của SYSTEM). */
export class CeremonyPrintBookDto {
  /** Id bài khấn theo đúng thứ tự xuất hiện trong sách. */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @IsInt({ each: true })
  ids: number[];

  /** Tên dòng họ điền vào chỗ "họ …" trong lời khấn (vd. "Nguyễn Đình"). */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clanName?: string;
}
