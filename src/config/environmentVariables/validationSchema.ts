import * as Joi from 'joi';
import { ConfigKeys } from './configuration.constants';
import { DatabaseType } from '../db/dbTypes.constants';
import { Environment } from './environment.constants';

const configSchemaMap: Record<ConfigKeys, Joi.Schema> = {
  [ConfigKeys.NODE_ENV]: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  [ConfigKeys.GLOBAL_PREFIX]: Joi.string().required(),
  [ConfigKeys.PORT]: Joi.number().required(),
  [ConfigKeys.DB_HOST]: Joi.string().required(),
  [ConfigKeys.DB_PORT]: Joi.number().required(),
  [ConfigKeys.DB_USER]: Joi.string().required(),
  [ConfigKeys.DB_PASSWORD]: Joi.string().required(),
  [ConfigKeys.DB_NAME]: Joi.string().required(),
  [ConfigKeys.DB_TYPE]: Joi.string()
    .valid(...Object.values(DatabaseType))
    .required(),
  [ConfigKeys.RATE_LIMIT_TTL]: Joi.number().required(),
  [ConfigKeys.RATE_LIMIT_MAX]: Joi.number().required(),
  [ConfigKeys.ALLOWED_ORIGINS]: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.array().items(Joi.string().uri()),
      Joi.string().pattern(/^\*$/), // Allow wildcard
      Joi.string().pattern(/^https?:\/\/[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/), // URL pattern
    )
    .required()
    .description('Allowed CORS origins - can be string, array, or "*"'),
};

const validationSchema = Joi.object(configSchemaMap);

export default validationSchema;
