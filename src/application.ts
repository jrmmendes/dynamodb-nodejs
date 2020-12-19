import express from 'express';
import { Container, Inject } from 'typescript-ioc';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { ConfigurationService } from './common/configuration';
import { DatabaseService } from './common/database';
import { Logger } from './common/logger';

export class Application {
  @Inject private config: ConfigurationService;
  @Inject private logger: Logger;

  private app: express.Application;
  private port: number;

  constructor() {
    this.port = this.config.get<number>('PORT');
    this.app = express();
  }

  configureMiddlewares() {
    this.app.use(cors());

    this.app.use(morgan('dev', {
      stream: {
        write: (message: string) => this
          .logger
          .label('Req')
          .info(message),
      }
    }));
    this.app.use(helmet());

    return this;
  }

  registerRoutes() {
    this.app.get('/', (req, res) => {
      const db = Container.get(DatabaseService);
      db.dynamo.createTable({
        TableName: 'books',
        KeySchema: [{
          AttributeName: 'author',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'name',
          KeyType: 'RANGE',
        }],
        AttributeDefinitions: [{
          AttributeName: 'author',
          AttributeType: 'S'
        },
        {
          AttributeName: 'name',
          AttributeType: 'S'
        }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }, (err, data) => {
        res.status(200).send({ payload: err || data });
      });
    });

    return this;
  }

  serve() {
    return this.app.listen(
      this.port,
      () => this
        .logger
        .label('express')
        .info(`Server started @ ${this.port}`)
    );
  }
}