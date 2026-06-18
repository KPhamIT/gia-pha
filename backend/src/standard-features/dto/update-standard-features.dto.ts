import { IsObject } from 'class-validator';

export class UpdateStandardFeaturesDto {
  @IsObject()
  features!: Record<string, boolean>;
}
