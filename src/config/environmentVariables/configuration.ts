import { ConfigurationStructure } from './ConfigurationStructure.interface';
import { CONFIG_KEYS } from './configuration.constants';
import { ENVIRONMENTS } from './environment.constants';

const isValidNodeEnv = (
  value: any,
): value is (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS] => {
  return Object.values(ENVIRONMENTS).includes(value);
};

export default (): ConfigurationStructure => {
  const nodeEnv = process.env[CONFIG_KEYS.NODE_ENV];

  if (!isValidNodeEnv(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV value: ${nodeEnv}`);
  }

  return {
    [CONFIG_KEYS.PORT]: parseInt(process.env[CONFIG_KEYS.PORT], 10),
    [CONFIG_KEYS.GLOBAL_PREFIX]: process.env[CONFIG_KEYS.GLOBAL_PREFIX],
    [CONFIG_KEYS.NODE_ENV]: nodeEnv,
    database: {
      [CONFIG_KEYS.DB_HOST]: process.env[CONFIG_KEYS.DB_HOST],
      [CONFIG_KEYS.DB_PORT]: parseInt(process.env[CONFIG_KEYS.DB_PORT], 10),
      [CONFIG_KEYS.DB_USER]: process.env[CONFIG_KEYS.DB_USER],
      [CONFIG_KEYS.DB_PASSWORD]: process.env[CONFIG_KEYS.DB_PASSWORD],
      [CONFIG_KEYS.DB_NAME]: process.env[CONFIG_KEYS.DB_NAME],
      [CONFIG_KEYS.DB_TYPE]: process.env[CONFIG_KEYS.DB_TYPE],
    },
  };
};
