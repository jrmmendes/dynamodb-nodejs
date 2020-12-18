import { Singleton } from 'typescript-ioc';
import { attempt, number, object, string } from 'joi';
import { exit, env } from 'process';
import dotenv from 'dotenv';

const schema = object({
  HOST: string().default('local'),
  PORT: number().default(3000),
  DYNAMO_ENDPOINT: string().default('http://localhost:27018'),
  DYNAMO_REGION: string().default('sa-east-1'),
  DYNAMO_ACCESS_KEY_ID: string().required(),
  DYNAMO_SECRET_ACCESS_KEY: string().required(),
});

type EnvironmentVariable =
  'HOST' |
  'PORT' |
  'DYNAMO_ENDPOINT' |
  'DYNAMO_REGION' |
  'DYNAMO_ACCESS_KEY_ID' |
  'DYNAMO_SECRET_ACCESS_KEY';

@Singleton
export class ConfigurationService {

  private variables;

  constructor() {
    dotenv.config();

    try {
      this.variables = attempt(env, schema, {
        abortEarly: false,
        allowUnknown: true
      });
    } catch (error) {
      const configErrors = error.message.split('. ');
      console.error({ configErrors });
      exit();
    }
  }

  get<T>(name: EnvironmentVariable): T {
    const value = <T>this.variables[name];
    return <T>value;
  }
}

