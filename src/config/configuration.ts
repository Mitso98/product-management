import { ConfigurationStructure } from './ConfigurationStructure.interface';
import { CONFIG_KEYS } from './configuration.constants';

export default (): ConfigurationStructure => ({
  [CONFIG_KEYS.PORT]: parseInt(process.env[CONFIG_KEYS.PORT], 10),
  [CONFIG_KEYS.GLOBAL_PREFIX]: process.env[CONFIG_KEYS.GLOBAL_PREFIX],
  [CONFIG_KEYS.NODE_ENV]: process.env[CONFIG_KEYS.NODE_ENV],
  database: {
    [CONFIG_KEYS.POSTGRES_USER]: process.env[CONFIG_KEYS.POSTGRES_USER],
    [CONFIG_KEYS.POSTGRES_PASSWORD]: process.env[CONFIG_KEYS.POSTGRES_PASSWORD],
    [CONFIG_KEYS.POSTGRES_DB]: process.env[CONFIG_KEYS.POSTGRES_DB],
  },
});
