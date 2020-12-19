/* eslint-disable no-console */
import { Singleton } from 'typescript-ioc';
import {
  attempt, number, object, string,
} from 'joi';
import { exit, env } from 'process';
import dotenv from 'dotenv';

const schema = object({
  LOGGING_LEVEL: string().valid('debug', 'info', 'error', 'warn').default('info'),
  PORT: number().default(3000),
  DYNAMO_ENDPOINT: string().default('http://localhost:27018'),
  DYNAMO_REGION: string().default('sa-east-1'),
  DYNAMO_ACCESS_KEY_ID: string().required(),
  DYNAMO_SECRET_ACCESS_KEY: string().required(),
});

type EnvironmentVariable =
  'PORT' |
  'DYNAMO_ENDPOINT' |
  'DYNAMO_REGION' |
  'DYNAMO_ACCESS_KEY_ID' |
  'DYNAMO_SECRET_ACCESS_KEY' |
  'LOGGING_LEVEL';

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
}
