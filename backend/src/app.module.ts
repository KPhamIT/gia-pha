import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PersonModule } from './person/person.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RelationshipModule } from './relationship/relationship.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { EventModule } from './event/event.module.js';
import { ExportPresetModule } from './export-preset/export-preset.module.js';
import { OrganizationModule } from './organization/organization.module.js';
import { UsersModule } from './users/users.module.js';
import { StandardFeaturesModule } from './standard-features/standard-features.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { CeremoniesModule } from './ceremonies/ceremonies.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    PersonModule,
    AuthModule,
    RelationshipModule,
    SettingsModule,
    EventModule,
    ExportPresetModule,
    OrganizationModule,
    UsersModule,
    StandardFeaturesModule,
    NotificationsModule,
    CeremoniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
