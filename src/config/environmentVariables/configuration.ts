import { DatabaseType } from '../db/dbTypes.constants';
import { ConfigurationInterface } from './configurationInterface.interface';
import { ConfigKeys } from './configuration.constants';
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
    const requiredEnvVars = Object.values(ConfigKeys).filter(
      (key) => ![].includes(key), // optional keys here
    );

    this.validateRequiredEnvVars(requiredEnvVars);

    const nodeEnv = process.env[ConfigKeys.NODE_ENV];
    const dbType = process.env[ConfigKeys.DB_TYPE];

    this.validateEnvironment(nodeEnv);
    this.validateDatabaseType(dbType);
    // Create and cache the configuration
    cachedConfig = {
      app: {
        [ConfigKeys.PORT]: parseInt(process.env[ConfigKeys.PORT], 10),
        [ConfigKeys.GLOBAL_PREFIX]: process.env[ConfigKeys.GLOBAL_PREFIX],
        [ConfigKeys.NODE_ENV]: nodeEnv as Environment,
        [ConfigKeys.ALLOWED_ORIGINS]:
          process.env[ConfigKeys.ALLOWED_ORIGINS]?.split(',') || '*',
        [ConfigKeys.RATE_LIMIT_TTL]: parseInt(
          process.env[ConfigKeys.RATE_LIMIT_TTL],
          10,
        ),
        [ConfigKeys.RATE_LIMIT_MAX]: parseInt(
          process.env[ConfigKeys.RATE_LIMIT_MAX],
          10,
        ),
        [ConfigKeys.API_VERSION_PREFIX]:
          process.env[ConfigKeys.API_VERSION_PREFIX] || 'v',
        [ConfigKeys.API_DEFAULT_VERSION]:
          process.env[ConfigKeys.API_DEFAULT_VERSION] || '1',
      },
      jwt: {
        [ConfigKeys.JWT_SECRET]: process.env[ConfigKeys.JWT_SECRET],
        [ConfigKeys.JWT_EXPIRES_IN]: process.env[ConfigKeys.JWT_EXPIRES_IN],
      },
      superAdmin: {
        [ConfigKeys.SUPER_ADMIN_EMAIL]:
          process.env[ConfigKeys.SUPER_ADMIN_EMAIL],
        [ConfigKeys.SUPER_ADMIN_PASSWORD]:
          process.env[ConfigKeys.SUPER_ADMIN_PASSWORD],
      },
      redis: {
        [ConfigKeys.REDIS_HOST]: process.env[ConfigKeys.REDIS_HOST],
        [ConfigKeys.REDIS_PORT]: parseInt(
          process.env[ConfigKeys.REDIS_PORT],
          10,
        ),
        [ConfigKeys.CACHE_TTL]: parseInt(process.env[ConfigKeys.CACHE_TTL], 10),
        [ConfigKeys.CACHE_MAX_ITEMS]: parseInt(
          process.env[ConfigKeys.CACHE_MAX_ITEMS],
          10,
        ),
      },
      database: {
        [ConfigKeys.DB_HOST]: process.env[ConfigKeys.DB_HOST],
        [ConfigKeys.DB_PORT]: parseInt(process.env[ConfigKeys.DB_PORT], 10),
        [ConfigKeys.DB_USER]: process.env[ConfigKeys.DB_USER],
        [ConfigKeys.DB_PASSWORD]: process.env[ConfigKeys.DB_PASSWORD],
        [ConfigKeys.DB_NAME]: process.env[ConfigKeys.DB_NAME],
        [ConfigKeys.DB_TYPE]: dbType as DatabaseType,
      },
    };

    return cachedConfig;
  }
}

export default () => ConfigurationFactory.createConfiguration();
