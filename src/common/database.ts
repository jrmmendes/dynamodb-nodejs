import dynamoose from 'dynamoose';
import { Inject } from 'typescript-ioc';
import { ConfigurationService } from './configuration';
import { Logger } from './logger';

export abstract class DatabaseService {
  @Inject private static config: ConfigurationService;

  @Inject private static logger: Logger;

  static init() {
    if (this.config.isLocal) {
      this
        .logger
        .label('DATABASE')
        .info('Using DynamoDB Local');

      dynamoose.aws.ddb.local();
    } else {
      const ddb = new dynamoose.aws.sdk.DynamoDB({
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
        region: this.config.get('AWS_REGION'),
      });
      dynamoose.aws.ddb.set(ddb);
    }
  }
}
