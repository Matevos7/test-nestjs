import { DocumentService } from '@resources/document/document.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

import { Topic } from '@common/enums';
import { IKafkaConfig } from '@common/models';

import { IFileMessage } from './models';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  private readonly kafkaConfig =
    this.configService.get<IKafkaConfig>('KAFKA_CONFIG');

  constructor(
    private readonly documentService: DocumentService,

    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: [this.kafkaConfig.broker],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.kafkaConfig.consumerGroupId,
    });

    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: Topic.FILE_CREATED_REPLY });

    this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;

        if (topic === Topic.FILE_CREATED_REPLY) {
          const data: IFileMessage = JSON.parse(message.value.toString());
          const key = message.key?.toString() || data.id;

          this.logger.debug(`Received message: ${JSON.stringify(data)}`);
          if (key) {
            await this.documentService.update(key, {
              path: data.path || null,
              status: data.status,
            });
          }
        }
      },
    });

    this.logger.log('KafkaService initialized and consumer running.');
  }

  async produceMessage<T>(key: string, topic: string, data: T) {
    const value = JSON.stringify(data);

    try {
      await this.producer.send({
        topic,
        messages: [{ key, value }],
      });
      this.logger.log(`Message produced successfully to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to produce message to topic: ${topic}`, error);
      throw error;
    }
  }
}
