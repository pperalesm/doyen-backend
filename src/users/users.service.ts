import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../database/entities/user.entity';

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
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return await this.usersRepository.findOneBy([
      { username: usernameOrEmail },
      { email: usernameOrEmail },
    ]);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.usersRepository.update(
      { id: id },
      { refreshToken: refreshToken },
    );
  }

  async deleteRefreshToken(id: string) {
    return await this.usersRepository.update(
      { id: id },
      { refreshToken: null },
    );
  }
}
