import { CONFIG_KEYS } from './configuration.constants';

export interface ConfigurationStructure {
  [CONFIG_KEYS.PORT]: number;
  [CONFIG_KEYS.GLOBAL_PREFIX]: string;
  [CONFIG_KEYS.NODE_ENV]: 'development' | 'production' | 'test';
  database: {
    [CONFIG_KEYS.DB_HOST]: string;
    [CONFIG_KEYS.DB_PORT]: number;
    [CONFIG_KEYS.DB_USER]: string;
    [CONFIG_KEYS.DB_PASSWORD]: string;
    [CONFIG_KEYS.DB_NAME]: string;
    [CONFIG_KEYS.DB_TYPE]: string;
  };
}
