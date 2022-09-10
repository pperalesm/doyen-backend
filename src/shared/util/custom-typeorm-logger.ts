import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'typeorm';

export class CustomTypeOrmLogger implements Logger {
  logger = new NestLogger('TypeORM');

  logQuery(query: string) {
    this.logger.log(`Queried --${query}--`);
  }

  logQueryError(_: string | Error, query: string) {
    this.logger.error(`Queried --${query}--`);
  }

  logQuerySlow(time: number, query: string) {
    this.logger.warn(`Query --${query}-- \x1b[31m+${time}ms\x1b[0m`);
  }

  logSchemaBuild(message: string) {
    this.logger.log(`SchemaBuild ${message}`);
  }

  logMigration(message: string) {
    this.logger.log(`Migration ${message}`);
  }

  log(level: 'warn' | 'info' | 'log', message: any) {
    if (level === 'warn') {
      this.logger.warn(message);
    } else {
      this.logger.log(message);
    }
  }
}
