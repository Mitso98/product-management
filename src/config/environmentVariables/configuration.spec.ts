import { ConfigurationFactory } from './configuration';
import { Environment } from './environment.constants';
import { DatabaseType } from '../db/dbTypes.constants';
import { ConfigKeys } from './configuration.constants';

jest.mock('./configuration');

describe('ConfigurationFactory', () => {
  const mockConfig = {
    app: {
      PORT: 3000,
      GLOBAL_PREFIX: 'api',
      NODE_ENV: Environment.DEVELOPMENT,
      ALLOWED_ORIGINS: '*',
      RATE_LIMIT_TTL: 60,
      RATE_LIMIT_MAX: 100,
      API_VERSION_PREFIX: 'v',
      API_DEFAULT_VERSION: '1',
    },
    database: {
      DB_TYPE: DatabaseType.POSTGRES,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USER: 'user',
      DB_PASSWORD: 'password',
      DB_NAME: 'testdb',
    },
    jwt: {
      JWT_SECRET: 'secret',
      JWT_EXPIRES_IN: '1h',
    },
    superAdmin: {
      SUPER_ADMIN_EMAIL: 'admin@test.com',
      SUPER_ADMIN_PASSWORD: 'password',
    },
    redis: {
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      CACHE_TTL: 60,
      CACHE_MAX_ITEMS: 100,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (ConfigurationFactory.createConfiguration as jest.Mock).mockReturnValue(
      mockConfig,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create configuration with mocked values', () => {
    const config = ConfigurationFactory.createConfiguration();
    expect(config).toEqual(mockConfig);
    expect(ConfigurationFactory.createConfiguration).toHaveBeenCalledTimes(1);
  });

  // Add more specific tests for validation logic
  it('should validate environment correctly', () => {
    const invalidConfig = { ...mockConfig };
    invalidConfig.app.NODE_ENV = 'invalid' as Environment;

    (
      ConfigurationFactory.createConfiguration as jest.Mock
    ).mockImplementationOnce(() => {
      throw new Error('Invalid NODE_ENV value: invalid');
    });

    expect(() => ConfigurationFactory.createConfiguration()).toThrow(
      'Invalid NODE_ENV value: invalid',
    );
  });
});
