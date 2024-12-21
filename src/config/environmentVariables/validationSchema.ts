import * as Joi from 'joi';
import { CONFIG_KEYS, ConfigKeys } from './configuration.constants';
import { DatabaseType } from '../db/dbTypes.constants';
import { Environment } from './environment.constants';

const configSchemaMap: Record<ConfigKeys, Joi.Schema> = {
  [CONFIG_KEYS.NODE_ENV]: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  [CONFIG_KEYS.GLOBAL_PREFIX]: Joi.string().required(),
  [CONFIG_KEYS.PORT]: Joi.number().required(),
  [CONFIG_KEYS.DB_HOST]: Joi.string().required(),
  [CONFIG_KEYS.DB_PORT]: Joi.number().required(),
  [CONFIG_KEYS.DB_USER]: Joi.string().required(),
  [CONFIG_KEYS.DB_PASSWORD]: Joi.string().required(),
  [CONFIG_KEYS.DB_NAME]: Joi.string().required(),
  [CONFIG_KEYS.DB_TYPE]: Joi.string()
    .valid(...Object.values(DatabaseType))
    .required(),
};

const validationSchema = Joi.object(configSchemaMap);

export default validationSchema;
