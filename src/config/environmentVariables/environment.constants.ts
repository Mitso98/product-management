export const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
  } as const;
  
  export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];