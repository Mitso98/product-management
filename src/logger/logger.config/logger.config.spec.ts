import { ConfigService } from '@nestjs/config';
import { LoggerConfig } from './logger.config';
import { Environment } from '../../config/environmentVariables/environment.constants';
import * as winston from 'winston';

describe('LoggerConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'app.NODE_ENV') {
        return Environment.DEVELOPMENT;
      }
      return undefined;
    });
  });

  describe('create', () => {
    it('should create logger config with correct settings', () => {
      const config = LoggerConfig.create(configService);

      // Test basic config properties
      expect(config).toBeDefined();
      expect(config.level).toBe('debug');
      expect(config.exitOnError).toBe(false);

      // Test transports
      expect(config.transports).toHaveLength(3);
      expect(config.transports[0]).toBeInstanceOf(winston.transports.Console);
      expect(config.transports[1]).toBeInstanceOf(
        winston.transports.DailyRotateFile,
      );
      expect(config.transports[2]).toBeInstanceOf(
        winston.transports.DailyRotateFile,
      );

      // Test rejection handlers
      expect(config.rejectionHandlers).toHaveLength(1);
      expect(config.rejectionHandlers[0]).toBeInstanceOf(
        winston.transports.File,
      );
    });

    it('should use info level in production', () => {
      jest.spyOn(configService, 'get').mockReturnValue(Environment.PRODUCTION);

      const config = LoggerConfig.create(configService);

      expect(config.level).toBe('info');
      expect(config.transports[0].level).toBe('info');
    });
  });
});
