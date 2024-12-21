import { DatabaseType } from 'typeorm';
import { CONFIG_KEYS } from './configuration.constants';
import { Environment } from './environment.constants';

/** Application configuration interface */
export interface AppConfigInterface {
  [CONFIG_KEYS.PORT]: number;
  [CONFIG_KEYS.GLOBAL_PREFIX]: string;
  [CONFIG_KEYS.NODE_ENV]: Environment;
}

/** Database connection configuration interface */
export interface DatabaseConfigInterface {
  [CONFIG_KEYS.DB_HOST]: string;
  [CONFIG_KEYS.DB_PORT]: number;
  [CONFIG_KEYS.DB_USER]: string;
  [CONFIG_KEYS.DB_PASSWORD]: string;
  [CONFIG_KEYS.DB_NAME]: string;
  [CONFIG_KEYS.DB_TYPE]: DatabaseType;
}

/** Main configuration interface combining all config sections */
export interface ConfigurationInterface {
  app: AppConfigInterface;
  database: DatabaseConfigInterface;
}
