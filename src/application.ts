import express from 'express';
import { Container, Inject } from 'typescript-ioc';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { ConfigurationService } from './common/configuration';
import { Logger } from './common/logger';
import { DatabaseService } from './common/database';

export class Application {
  @Inject private config: ConfigurationService;

  @Inject private logger: Logger;

  private app: express.Application;

  private port: number;

  constructor() {
    DatabaseService.init();
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
      },
    }));
    this.app.use(helmet());

    return this;
  }

  registerRoutes() {
    this.app.get('/', (_req, res) => {
      res.status(200).end();
    });

    return this;
  }

  serve() {
    return this.app.listen(
      this.port,
      () => this
        .logger
        .label('express')
        .info(`Server started @ ${this.port}`),
    );
  }
}
