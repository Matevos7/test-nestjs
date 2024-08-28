import { registerAs } from '@nestjs/config';

import { IKafkaConfig } from '@common/models';

export default registerAs(
  'KAFKA_CONFIG',
  (): IKafkaConfig => ({
    broker: process.env.KAFKA_BROKER,
    consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  }),
);
