import { CONFIG_KEYS } from './configuration.constants';

export interface ConfigurationStructure {
  [CONFIG_KEYS.PORT]: number;
  [CONFIG_KEYS.GLOBAL_PREFIX]: string;
  [CONFIG_KEYS.NODE_ENV]: string;
  database: {
    [CONFIG_KEYS.POSTGRES_USER]: string;
    [CONFIG_KEYS.POSTGRES_PASSWORD]: string;
    [CONFIG_KEYS.POSTGRES_DB]: string;
  };
}
