import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return await this.usersService.create(signUpDto);
  }

  signIn(authUser: User) {
    return this.jwtService.sign({ sub: authUser.id });
  }
}
