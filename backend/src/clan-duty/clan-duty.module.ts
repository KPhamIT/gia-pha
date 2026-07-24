import { Module } from '@nestjs/common';
import { ClanDutyController } from './clan-duty.controller.js';
import { ClanDutyService } from './clan-duty.service.js';

@Module({
  controllers: [ClanDutyController],
  providers: [ClanDutyService],
})
export class ClanDutyModule {}
