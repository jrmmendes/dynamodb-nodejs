import dynamoose from 'dynamoose';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ConfigurationService } from './configuration';
import { Logger } from './logger';

@InRequestScope
export class DatabaseService {
  @Inject private config: ConfigurationService;

  @Inject private logger: Logger;

  constructor() {
    if (this.config.isLocal) {
      this.logger.label('TEST').info('Using DynamoDB Local');
      dynamoose.aws.ddb.local();
    }
  }
}
