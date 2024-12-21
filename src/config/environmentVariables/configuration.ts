import { DatabaseType } from '../db/dbTypes.constants';
import { ConfigurationInterface } from './configurationInterface.interface';
import { CONFIG_KEYS } from './configuration.constants';
import { Environment } from './environment.constants';

let cachedConfig: ConfigurationInterface | null = null;

const isValidNodeEnv = (
  value: any,
): value is (typeof Environment)[keyof typeof Environment] => {
  return Object.values(Environment).includes(value);
};

const isValidDatabaseType = (
  value: any,
): value is (typeof DatabaseType)[keyof typeof DatabaseType] => {
  return Object.values(DatabaseType).includes(value);
};

class ConfigurationFactory {
  private static validateRequiredEnvVars(requiredVars: string[]): void {
    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`,
      );
    }
  }

  private static validateEnvironment(env: unknown): void {
    if (!isValidNodeEnv(env)) {
      throw new Error(`Invalid NODE_ENV value: ${env}`);
    }
  }

  private static validateDatabaseType(type: unknown): void {
    if (!isValidDatabaseType(type)) {
      throw new Error(`Invalid DB_TYPE value: ${type}`);
    }
  }

  static createConfiguration(): ConfigurationInterface {
    if (cachedConfig) {
      return cachedConfig;
    }

    // Get all config keys and filter out any optional ones
    const requiredEnvVars = Object.values(CONFIG_KEYS).filter(
      (key) => ![].includes(key), // optional keys here
    );

    this.validateRequiredEnvVars(requiredEnvVars);

    const nodeEnv = process.env[CONFIG_KEYS.NODE_ENV];
    const dbType = process.env[CONFIG_KEYS.DB_TYPE];

    this.validateEnvironment(nodeEnv);
    this.validateDatabaseType(dbType);

    // Create and cache the configuration
    cachedConfig = {
      app: {
        [CONFIG_KEYS.PORT]: parseInt(process.env[CONFIG_KEYS.PORT], 10),
        [CONFIG_KEYS.GLOBAL_PREFIX]: process.env[CONFIG_KEYS.GLOBAL_PREFIX],
        [CONFIG_KEYS.NODE_ENV]: nodeEnv as Environment,
      },
      database: {
        [CONFIG_KEYS.DB_HOST]: process.env[CONFIG_KEYS.DB_HOST],
        [CONFIG_KEYS.DB_PORT]: parseInt(process.env[CONFIG_KEYS.DB_PORT], 10),
        [CONFIG_KEYS.DB_USER]: process.env[CONFIG_KEYS.DB_USER],
        [CONFIG_KEYS.DB_PASSWORD]: process.env[CONFIG_KEYS.DB_PASSWORD],
        [CONFIG_KEYS.DB_NAME]: process.env[CONFIG_KEYS.DB_NAME],
        [CONFIG_KEYS.DB_TYPE]: dbType as DatabaseType,
      },
    };

    return cachedConfig;
  }
}

export default () => ConfigurationFactory.createConfiguration();
