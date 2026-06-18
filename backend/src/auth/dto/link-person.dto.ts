import { IsInt, IsOptional, Min } from 'class-validator';

export class LinkPersonDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  personId?: number | null;
}
