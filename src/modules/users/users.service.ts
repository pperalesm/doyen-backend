import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '../../database/entities/user.entity';
import { FindAllDto } from './dto/find-all.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(signUpDto: SignUpDto) {
    let user = this.usersRepository.create({ ...signUpDto });
    return await this.dataSource.transaction(async (entityManager) => {
      user = await entityManager.save(user);
      await this.notificationsService.userActivation(user);
      return user;
    });
  }

  async findOneById(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ id: id })
      .getOne();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ email: email })
      .getOne();
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where([{ username: usernameOrEmail }, { email: usernameOrEmail }])
      .getOne();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: refreshToken })
      .where({ id: id })
      .execute();
  }

  async deleteRefreshToken(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: null })
      .where({ id: id })
      .execute();
  }

  async findAll(findAllDto: FindAllDto) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ isPublic: true })
      .orderBy({ gains: 'DESC' })
      .take(findAllDto?.take || 10)
      .skip(findAllDto?.skip)
      .getMany();
  }

  async activate(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where({ id: id })
      .execute();
  }

  async updatePassword(id: string, password: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ password: password })
      .where({ id: id })
      .execute();
  }
}
