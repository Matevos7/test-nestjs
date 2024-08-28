import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(5000),
  ENVIRONMENT: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  APP_VERSION: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5496),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CONSUMER_GROUP_ID: Joi.string().required(),
});
