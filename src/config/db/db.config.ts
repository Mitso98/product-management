import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ENVIRONMENTS } from '../environmentVariables/environment.constants';
import { CONFIG_KEYS } from '../environmentVariables/configuration.constants';

const getEntities = (): Function[] => {
  const entitiesPath = path.join(__dirname, '..', '..', 'entities');
  return fs
    .readdirSync(entitiesPath)
    .filter(
      (file) => file.endsWith('.entity.ts') || file.endsWith('.entity.js'),
    )
    .map((file) => {
      const entityModule = require(path.join(entitiesPath, file));
      const entityClass = Object.values(entityModule).find(
        (exported) => typeof exported === 'function',
      );
      return entityClass;
    });
};

console.log('>>>', getEntities());

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  console.log(
    '###',
    configService.get<string>(CONFIG_KEYS.NODE_ENV) !== ENVIRONMENTS.PRODUCTION,
  );
  return {
    type: configService.get(CONFIG_KEYS.DB_TYPE) as any,
    host: configService.get<string>(CONFIG_KEYS.DB_HOST),
    port: configService.get<number>(CONFIG_KEYS.DB_PORT),
    username: configService.get<string>(CONFIG_KEYS.DB_USER),
    password: configService.get<string>(CONFIG_KEYS.DB_PASSWORD),
    database: configService.get<string>(CONFIG_KEYS.DB_NAME),
    entities: getEntities(),
    synchronize:
      configService.get<string>(CONFIG_KEYS.NODE_ENV) !==
      ENVIRONMENTS.PRODUCTION,
    logging:
      configService.get(CONFIG_KEYS.NODE_ENV) === ENVIRONMENTS.DEVELOPMENT,
  };
};
