import { DatabaseType } from '../db/dbTypes.constants';
import { ConfigurationInterface } from './ConfigurationInterface.interface';
import { CONFIG_KEYS } from './configuration.constants';
import { ENVIRONMENTS } from './environment.constants';

const isValidNodeEnv = (
  value: any,
): value is (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS] => {
  return Object.values(ENVIRONMENTS).includes(value);
};

const isValidDatabaseType = (
  value: any,
): value is (typeof DatabaseType)[keyof typeof DatabaseType] => {
  return Object.values(DatabaseType).includes(value);
};

export default (): ConfigurationInterface => {
  const nodeEnv = process.env[CONFIG_KEYS.NODE_ENV];
  const dbType = process.env[CONFIG_KEYS.DB_TYPE];

  if (!isValidNodeEnv(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV value: ${nodeEnv}`);
  }

  if (!isValidDatabaseType(dbType)) {
    throw new Error(
      `Invalid DB_TYPE value: ${process.env[CONFIG_KEYS.DB_TYPE]}`,
    );
  }

  return {
    app: {
      [CONFIG_KEYS.PORT]: parseInt(process.env[CONFIG_KEYS.PORT], 10),
      [CONFIG_KEYS.GLOBAL_PREFIX]: process.env[CONFIG_KEYS.GLOBAL_PREFIX],
      [CONFIG_KEYS.NODE_ENV]: nodeEnv,
    },
    database: {
      [CONFIG_KEYS.DB_HOST]: process.env[CONFIG_KEYS.DB_HOST],
      [CONFIG_KEYS.DB_PORT]: parseInt(process.env[CONFIG_KEYS.DB_PORT], 10),
      [CONFIG_KEYS.DB_USER]: process.env[CONFIG_KEYS.DB_USER],
      [CONFIG_KEYS.DB_PASSWORD]: process.env[CONFIG_KEYS.DB_PASSWORD],
      [CONFIG_KEYS.DB_NAME]: process.env[CONFIG_KEYS.DB_NAME],
      [CONFIG_KEYS.DB_TYPE]: dbType,
    },
  };
};
