import { DynamoDB } from "aws-sdk";
import { Inject, InRequestScope } from "typescript-ioc";
import { ConfigurationService } from "./configuration";

@InRequestScope
export class DatabaseService {

  @Inject
  private config: ConfigurationService;

  public dynamo: DynamoDB;

  constructor() {
    this.dynamo = new DynamoDB({
      endpoint: this.config.get<string>('DYNAMO_ENDPOINT'),
      region: this.config.get<string>('DYNAMO_REGION'),
      accessKeyId: this.config.get<string>('DYNAMO_SECRET_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('DYNAMO_SECRET_ACCESS_KEY'),
    });
  }
}