import { ConfigService } from '@nestjs/config';
import { glob } from 'glob';
import path from 'path';
import { Environment } from '../environmentVariables/environment.constants';
import {
  AppConfigInterface,
  DatabaseConfigInterface,
} from '../environmentVariables/configurationInterface.interface';

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
  const dbVars = configService.get<DatabaseConfigInterface>('database');
  const appVars = configService.get<AppConfigInterface>('app');

  return {
    type: dbVars.DB_TYPE as any,
    host: dbVars.DB_HOST,
    port: dbVars.DB_PORT,
    username: dbVars.DB_USER,
    password: dbVars.DB_PASSWORD,
    database: dbVars.DB_NAME,
    entities: await getEntities(),
    synchronize: appVars.NODE_ENV !== Environment.PRODUCTION,
    logging: appVars.NODE_ENV === Environment.DEVELOPMENT,
  };
};
