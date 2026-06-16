import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PersonModule } from './person/person.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RelationshipModule } from './relationship/relationship.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { EventModule } from './event/event.module.js';
import { ExportPresetModule } from './export-preset/export-preset.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PersonModule,
    AuthModule,
    RelationshipModule,
    SettingsModule,
    EventModule,
    ExportPresetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
