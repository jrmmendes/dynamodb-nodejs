/* eslint-disable no-console */
import { Singleton } from 'typescript-ioc';
import {
  attempt, number, object, string,
} from 'joi';
import { exit, env } from 'process';
import dotenv from 'dotenv';

const schema = object({
  LOGGING_LEVEL: string()
    .valid(
      'debug',
      'info',
      'error',
      'warn',
    ).default('info'),
  PORT: number().default(3000),
  AWS_ACCESS_KEY_ID: string(),
  AWS_SECRET_ACCESS_KEY: string(),
  AWS_REGION: string(),
  ENVIRONMENT: string().valid(
    'LOCAL',
    'DEVELOPMENT',
    'HOMOLOGATION',
    'PRODUCTION',
  ).default('PRODUCTION'),
});

type EnvironmentVariable =
  'PORT'|
  'LOGGING_LEVEL' |
  'AWS_ACCESS_KEY_ID' |
  'AWS_SECRET_ACCESS_KEY' |
  'AWS_REGION' |
  'ENVIRONMENT';

@Singleton
export class ConfigurationService {
  private variables;

  constructor() {
    dotenv.config();

    try {
      this.variables = attempt(env, schema, {
        abortEarly: false,
        allowUnknown: true,
      });
    } catch (error) {
      console.log('[CONFIGURATION] Cannot find some required variables in environment: \n');
      const configErrors = error.message.replace('. ', '\n');
      console.error(configErrors);
      exit();
    }
    console.log('[CONFIGURATION] All required variables found in environment!\n');
  }

  get<T>(name: EnvironmentVariable): T {
    return <T> this.variables[name];
  }

  get isProduction() {
    return this
      .get<string>('ENVIRONMENT')
      .toUpperCase() === 'PRODUCTION';
  }

  get isLocal() {
    return this
      .get<string>('ENVIRONMENT')
      .toUpperCase() === 'LOCAL';
  }

  get isDevelopment() {
    return this
      .get<string>('ENVIRONMENT')
      .toUpperCase() === 'DEVELOPMENT';
  }

  get isHomologation() {
    return this
      .get<string>('ENVIRONMENT')
      .toUpperCase() === 'HOMOLOGATION';
  }
}
