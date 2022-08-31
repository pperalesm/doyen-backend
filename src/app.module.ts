import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { MyTypeOrmLogger } from './util/my-typeorm-logger';
import { SnakeNamingStrategy } from './util/snake-naming-strategy';
import { User } from './database/entities/user.entity';
import { dataSourceOptions } from './database/typeOrm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
