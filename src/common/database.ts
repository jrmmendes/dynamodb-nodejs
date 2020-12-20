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
    }
  }
}
