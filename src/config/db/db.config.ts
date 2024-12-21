import { ConfigService } from '@nestjs/config';
import { glob } from 'glob';
import path from 'path';
import { CONFIG_KEYS } from '../environmentVariables/configuration.constants';
import { ENVIRONMENTS } from '../environmentVariables/environment.constants';

const findEntityFiles = async (): Promise<string[]> => {
  const entityFiles = await glob('src/**/*.entity.{ts,js}', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  return entityFiles.map((file) => path.resolve(file));
};

const getEntities = async () => {
  const entityPaths = await findEntityFiles();
  return entityPaths.map((entityPath) => require(entityPath).default);
};

export const getDatabaseConfig = async (configService: ConfigService) => {
  return {
    type: configService.get(CONFIG_KEYS.DB_TYPE) as any,
    host: configService.get<string>(CONFIG_KEYS.DB_HOST),
    port: configService.get<number>(CONFIG_KEYS.DB_PORT),
    username: configService.get<string>(CONFIG_KEYS.DB_USER),
    password: configService.get<string>(CONFIG_KEYS.DB_PASSWORD),
    database: configService.get<string>(CONFIG_KEYS.DB_NAME),
    entities: await getEntities(),
    synchronize:
      configService.get<string>(CONFIG_KEYS.NODE_ENV) !==
      ENVIRONMENTS.PRODUCTION,
    logging:
      configService.get(CONFIG_KEYS.NODE_ENV) === ENVIRONMENTS.DEVELOPMENT,
  };
};
