import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';
import { User } from '../src/database/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { MyTypeOrmLogger } from '../src/shared/util/my-typeorm-logger';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { SnakeNamingStrategy } from '../src/shared/util/snake-naming-strategy';
import { AuthModule } from '../src/auth/auth.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let usersRepository: Repository<User>;
  let user1: User | null;
  let user2: User | null;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: 'test_users',
          synchronize: true,
          logging: ['warn'],
          logger: new MyTypeOrmLogger(),
          namingStrategy: new SnakeNamingStrategy(),
          entities: [User],
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    server = app.getHttpServer();
    usersRepository = moduleRef.get(getRepositoryToken(User));
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });

  afterAll(async () => {
    await usersRepository.query('DELETE FROM users');
    await app.close();
  });

  // it('/ (POST)', async () => {
  //   let response = await request(server).post('/auth/signup').send({
  //     email: 'hola@hola.com',
  //     username: 'pepe',
  //     password: 'password1243',
  //   });

  //   expect(response.status).toEqual(201);
  //   expect(response.body).toStrictEqual({
  //     id: response.body.id,
  //     email: 'hola@hola.com',
  //     username: 'pepe',
  //     isPublic: false,
  //     isVerified: false,
  //     acceptsEmails: true,
  //     language: 'en',
  //     description: null,
  //     imageUrl: null,
  //     name: null,
  //     profession: null,
  //   });

  //   user1 = await usersRepository.findOne({
  //     where: { id: response.body.id },
  //   });

  //   expect(user1).toBeDefined();
  //   expect({ ...user1 }).toStrictEqual({
  //     id: user1?.id,
  //     email: 'hola@hola.com',
  //     username: 'pepe',
  //     password: user1?.password,
  //     name: null,
  //     imageUrl: null,
  //     description: null,
  //     profession: null,
  //     gains: 0,
  //     isPublic: false,
  //     isVerified: false,
  //     acceptsEmails: true,
  //     language: 'en',
  //     bannedUntil: null,
  //     createdAt: user1?.createdAt,
  //   });

  //   response = await request(server).post('/auth/signup').send({
  //     email: 'adios@adios.com',
  //     username: 'pepe2',
  //     password: 'afasfaasdasd',
  //     name: 'asfasf',
  //     imageUrl: 'as',
  //     description: 'as',
  //     profession: 'null',
  //     isPublic: true,
  //     acceptsEmails: false,
  //     language: 'en',
  //   });

  //   expect(response.status).toEqual(201);
  //   expect(response.body).toStrictEqual({
  //     id: response.body.id,
  //     email: 'adios@adios.com',
  //     username: 'pepe2',
  //     isPublic: true,
  //     isVerified: false,
  //     acceptsEmails: false,
  //     language: 'en',
  //     description: 'as',
  //     imageUrl: 'as',
  //     name: 'asfasf',
  //     profession: 'null',
  //   });

  //   user2 = await usersRepository.findOne({
  //     where: { id: response.body.id },
  //   });

  //   expect(user2).toBeDefined();
  //   expect({ ...user2 }).toStrictEqual({
  //     id: user2?.id,
  //     email: 'adios@adios.com',
  //     username: 'pepe2',
  //     password: user2?.password,
  //     name: 'asfasf',
  //     imageUrl: 'as',
  //     description: 'as',
  //     profession: 'null',
  //     isPublic: true,
  //     acceptsEmails: false,
  //     language: 'en',
  //     bannedUntil: null,
  //     gains: 0,
  //     isVerified: false,
  //     createdAt: user2?.createdAt,
  //   });
  // });

  it('/ (GET)', () => {
    expect('Test').toBeDefined();
  });
});
