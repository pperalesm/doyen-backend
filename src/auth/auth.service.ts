import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpDto: SignUpDto) {
    return await this.usersService.create(signUpDto);
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
