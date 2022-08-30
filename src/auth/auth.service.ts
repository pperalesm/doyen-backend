import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { hash } from './../util/hashing';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = this.usersRepository.create({
      ...signUpDto,
      password: await hash(signUpDto.password),
    });
    return await this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all auth`;
  }

  me() {
    return `This action returns a auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
