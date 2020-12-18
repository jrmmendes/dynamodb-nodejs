import express from 'express';
import { Container, Inject } from 'typescript-ioc';
import { DatabaseService } from './common/database';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { ConfigurationService } from './common/configuration';

export class Application {
  @Inject private config: ConfigurationService;
  
  private app: express.Application;
  private port: number;

  constructor() {
    this.port = this.config.get<number>('PORT');
    this.app = express();
  }

  configureMiddlewares() {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(helmet());

    return this;
  }

  registerRoutes() {
    this.app.get('/', (req, res) => {
      const db = Container.get(DatabaseService);
      db.dynamo.createTable({
        TableName: 'test',
        KeySchema: [{
          AttributeName: 'id',
          KeyType: 'HASH'
        }],
        AttributeDefinitions: [{
          AttributeName: 'id',
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
      () => console.log(`[APPLICATION] Server listening at port ${this.port}`)
    );
  }
}