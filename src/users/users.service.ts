import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../database/entities/user.entity';
import { hash } from '../shared/util/hashing';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(signUpDto: SignUpDto) {
    const user = this.usersRepository.create({
      ...signUpDto,
      password: await hash(signUpDto.password),
    });
    return await this.usersRepository.save(user);
  }

  async findOneById(id: string) {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOneBy({ username: username });
  }

  findAll() {
    return `This action returns all users`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
