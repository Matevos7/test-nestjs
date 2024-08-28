import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaModule } from '@shared/kafka';

import { Document } from '@common/database/entities';

import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), KafkaModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
