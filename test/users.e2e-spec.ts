import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { MyTypeOrmLogger } from '../src/shared/util/my-typeorm-logger';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;

  const populate = async () => {
    const user = usersRepository.create({});
    usersRepository.save(user);
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: 'test',
          entities: [User],
          synchronize: true,
          logging: ['warn'],
          logger: new MyTypeOrmLogger(),
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    usersRepository = moduleRef.get(getRepositoryToken(User));
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
    await populate();
  });

  afterEach(async () => {
    await usersRepository.query('DELETE FROM users');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Hello World!');
  });
});
