import { ConfigService } from '@nestjs/config';
import { Environment } from '../environmentVariables/environment.constants';
import {
  AppConfigInterface,
  DatabaseConfigInterface,
} from '../environmentVariables/configurationInterface.interface';

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
    entities: ["dist/**/*.entity.js"],
    synchronize: appVars.NODE_ENV !== Environment.PRODUCTION,
    logging: appVars.NODE_ENV === Environment.DEVELOPMENT,
  };
};
