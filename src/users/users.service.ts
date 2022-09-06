import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '../database/entities/user.entity';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(signUpDto: SignUpDto) {
    const user = this.usersRepository.create({ ...signUpDto });
    return await this.usersRepository.save(user);
  }

  async findOneById(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ id: id })
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
}
