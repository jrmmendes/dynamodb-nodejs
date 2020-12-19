import { Container, Inject } from 'typescript-ioc';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
  level
} from 'winston';
import { ConfigurationService } from './configuration';

const { combine, printf, timestamp } = format;

export class Logger {

  @Inject config: ConfigurationService;

  private instance: WinstonLogger;
  private logLabel: string;

  constructor() {
    this.instance = createLogger({
      level: this.config.get<string>('LOGGING_LEVEL'),
      format: combine(
        timestamp({ format: 'hh:mm:ss' }),
        printf(({ message, timestamp }) => (
          `[${timestamp}] ${message}`
        ))
      ),
      transports: [new transports.Console()],
    });
    Container.bind(Logger).factory(() => this.instance);
  }

  label(name: string) {
    this.logLabel = name;
    return this;
  }

  log(level: string, message: string) {
    return this.instance.log(level, `[${this.logLabel.toUpperCase()}] ${message}`);
  }

  info(message: string) {
    return this.log('info', message);
  }

  error(message: string) {
    return this.log('error', message);
  }
  
  warn(message: string) {
    return this.log('warn', message);
  }

  debug(message: string) {
    return this.log('debug', message);
  }  
}