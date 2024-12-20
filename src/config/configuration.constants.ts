export const CONFIG_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  POSTGRES_USER: 'POSTGRES_USER',
  POSTGRES_PASSWORD: 'POSTGRES_PASSWORD',
  POSTGRES_DB: 'POSTGRES_DB',
  GLOBAL_PREFIX: 'GLOBAL_PREFIX',
} as const;

export type ConfigKeys = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];