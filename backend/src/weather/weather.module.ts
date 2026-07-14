import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { OrganizationModule } from '../organization/organization.module.js';
import { WeatherController } from './weather.controller.js';
import { WeatherService } from './weather.service.js';

@Module({
  imports: [AuthModule, OrganizationModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
