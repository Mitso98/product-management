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
  [ConfigKeys.API_VERSION_PREFIX]: Joi.string().default('v'),
  [ConfigKeys.API_DEFAULT_VERSION]: Joi.string().default('1'),
  [ConfigKeys.JWT_SECRET]: Joi.string().required(),
  [ConfigKeys.ALLOWED_ORIGINS]: Joi.alternatives()
    .try(
      // Allow wildcard
      Joi.string().valid('*'),

      // Allow single URL
      Joi.string().uri({
        scheme: ['http', 'https'],
      }),

      // Allow comma-separated URLs
      Joi.string().pattern(/^(https?:\/\/[^,\s]+)(,\s*https?:\/\/[^,\s]+)*$/),

      // Allow array of URLs
      Joi.array().items(
        Joi.string().uri({
          scheme: ['http', 'https'],
        }),
      ),
    )
    .required(),
};

const validationSchema = Joi.object(configSchemaMap);

export default validationSchema;
