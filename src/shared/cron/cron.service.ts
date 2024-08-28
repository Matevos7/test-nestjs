import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import axios from 'axios';

import { DocumentService } from '@resources/document/document.service';
import { KafkaService } from '@shared/kafka';

import { DocumentStatus, Topic } from '@common/enums';
import { ArrayHelpers } from '@common/helpers';

@Injectable()
export class CronService {
  constructor(
    private readonly documentsService: DocumentService,

    private readonly kafkaService: KafkaService,
  ) {}

  /**
   * This method aimed to check the pending documents. Fallback in case the microservice is off. Runs At every second 15.
   * @returns {void}
   */
  @Cron('15 * * * * *')
  async checkPendingDocuments(): Promise<void> {
    const documents = await this.documentsService.findPendingDocuments({
      offset: 0,
      limit: 100,
    });

    for (const document of documents) {
      const { data } = await axios.get(document.url);
      if (!ArrayHelpers.isArrayOfObjects(data)) {
        await this.documentsService.update(document.id, {
          status: DocumentStatus.FAILED,
        });
      } else {
        await this.kafkaService.produceMessage(
          document.id,
          Topic.FILE_CREATED,
          data,
        );
      }
    }
  }
}
