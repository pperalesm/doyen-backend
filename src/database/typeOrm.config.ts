import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { MyTypeOrmLogger } from '../util/my-typeorm-logger';
import { SnakeNamingStrategy } from '../util/snake-naming-strategy';
import { User } from './entities/user.entity';

config();

export const dataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: ['query', 'warn'],
  logger: new MyTypeOrmLogger(),
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/database/migrations/*.js'],
  entities: [User],
} as DataSourceOptions;

export default new DataSource(dataSourceOptions);
