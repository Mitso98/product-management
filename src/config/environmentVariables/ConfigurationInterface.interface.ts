import { DatabaseType } from 'typeorm';
import { ConfigKeys } from './configuration.constants';
import { Environment } from './environment.constants';

export interface AppConfigInterface {
  [ConfigKeys.PORT]: number;
  [ConfigKeys.GLOBAL_PREFIX]: string;
  [ConfigKeys.NODE_ENV]: Environment;
  [ConfigKeys.ALLOWED_ORIGINS]: string | string[] | '*';
  [ConfigKeys.RATE_LIMIT_TTL]: number;
  [ConfigKeys.RATE_LIMIT_MAX]: number;
  [ConfigKeys.API_VERSION_PREFIX]: string;
  [ConfigKeys.API_DEFAULT_VERSION]: string;
  [ConfigKeys.JWT_SECRET]: string;
  [ConfigKeys.JWT_EXPIRES_IN]: string;
}

export interface DatabaseConfigInterface {
  [ConfigKeys.DB_HOST]: string;
  [ConfigKeys.DB_PORT]: number;
  [ConfigKeys.DB_USER]: string;
  [ConfigKeys.DB_PASSWORD]: string;
  [ConfigKeys.DB_NAME]: string;
  [ConfigKeys.DB_TYPE]: DatabaseType;
}

export interface ConfigurationInterface {
  app: AppConfigInterface;
  database: DatabaseConfigInterface;
}
