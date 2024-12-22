import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  let winstonLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    winstonLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: winstonLogger,
        },
      ],
    }).compile();

    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  describe('log', () => {
    it('should call winston logger log method', () => {
      const message = 'Test log message';
      const meta = { test: 'data' };
      const level = 'info';

      loggerService.log(level, message, meta);

      expect(winstonLogger.log).toHaveBeenCalledWith(level, message, meta);
    });
  });

  describe('error', () => {
    it('should call winston logger error method', () => {
      const message = 'Test error message';
      const meta = { error: new Error('test') };

      loggerService.error(message, meta);

      expect(winstonLogger.error).toHaveBeenCalledWith(message, meta);
    });
  });

  describe('warn', () => {
    it('should call winston logger warn method', () => {
      const message = 'Test warning message';
      const meta = { test: 'warning data' };

      loggerService.warn(message, meta);

      expect(winstonLogger.warn).toHaveBeenCalledWith(message, meta);
    });
  });

  describe('info', () => {
    it('should call winston logger info method', () => {
      const message = 'Test info message';
      const meta = { test: 'info data' };

      loggerService.info(message, meta);

      expect(winstonLogger.info).toHaveBeenCalledWith(message, meta);
    });
  });

  describe('debug', () => {
    it('should call winston logger debug method', () => {
      const message = 'Test debug message';
      const meta = { test: 'debug data' };

      loggerService.debug(message, meta);

      expect(winstonLogger.debug).toHaveBeenCalledWith(message, meta);
    });
  });
});
