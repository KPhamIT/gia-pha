import { IsIn, IsString } from 'class-validator';

export class DeleteMediaImageDto {
  @IsIn(['cloudinary', 'local'])
  provider: 'cloudinary' | 'local';

  @IsString()
  key: string;
}
