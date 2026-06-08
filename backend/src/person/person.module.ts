import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PersonService } from './person.service.js';
import { PersonController } from './person.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
