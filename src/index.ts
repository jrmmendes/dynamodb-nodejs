import { Application } from './application';

const application = new Application()

const server = application
  .configureMiddlewares()
  .registerRoutes()
  .serve();