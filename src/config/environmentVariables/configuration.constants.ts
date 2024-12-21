export const CONFIG_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  GLOBAL_PREFIX: 'GLOBAL_PREFIX',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_NAME: 'DB_NAME',
  DB_TYPE: 'DB_TYPE',
} as const;

export type ConfigKeys = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];
