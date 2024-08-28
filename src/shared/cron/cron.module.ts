import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DocumentModule } from '@resources/document/document.module';
import { KafkaModule } from '@shared/kafka';

import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot(), DocumentModule, KafkaModule],
  providers: [CronService],
})
export class CronModule {}
