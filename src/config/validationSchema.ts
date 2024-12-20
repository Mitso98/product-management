import * as Joi from 'joi';
import { CONFIG_KEYS, ConfigKeys } from './configuration.constants';

const configSchemaMap: Record<ConfigKeys, Joi.Schema> = {
  [CONFIG_KEYS.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  [CONFIG_KEYS.PORT]: Joi.number().required(),
  [CONFIG_KEYS.POSTGRES_USER]: Joi.string().required(),
  [CONFIG_KEYS.POSTGRES_PASSWORD]: Joi.string().required(),
  [CONFIG_KEYS.POSTGRES_DB]: Joi.string().required(),
  [CONFIG_KEYS.GLOBAL_PREFIX]: Joi.string().required(),
};

const validationSchema = Joi.object(configSchemaMap);

export default validationSchema;
