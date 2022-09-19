import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { CustomTypeOrmLogger } from '../shared/util/custom-typeorm-logger';
import { SnakeNamingStrategy } from '../shared/util/snake-naming-strategy';
import { User } from './entities/user.entity';
import { Notification } from './entities/notification.entity';
import { Category } from './entities/category.entity';
import { Meeting } from './entities/meeting.entity';
import { Bid } from './entities/bid.entity';
import { Collaboration } from './entities/collaboration.entity';
import { Purchase } from './entities/purchase.entity';
import { Step } from './entities/step.entity';

config();

export const dataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: ['query', 'warn'],
  logger: new CustomTypeOrmLogger(),
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/database/migrations/*.js'],
  entities: [
    User,
    Notification,
    Category,
    Meeting,
    Bid,
    Collaboration,
    Purchase,
    Step,
  ],
} as DataSourceOptions;

export default new DataSource(dataSourceOptions);
