import { Module, forwardRef } from '@nestjs/common';

import { KafkaService } from './kafka.service';
import { DocumentModule } from '@resources/document';

@Module({
  imports: [forwardRef(() => DocumentModule)],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
