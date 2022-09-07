import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import bcrypt from 'bcrypt';
import { HttpExceptionContent } from '../../shared/models/http-exception-content';
import { User } from '../../database/entities/user.entity';
import { randomBytes } from 'crypto';
import { MyUserDto } from './dto/my-user.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.usersService.create(signUpDto);
    return await this.generateTokens(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsernameOrEmail(
      signInDto.usernameOrEmail,
    );
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(signInDto.password, user.password)) ||
      (user.bannedUntil && user.bannedUntil.getTime() > Date.now())
    ) {
      throw new HttpException(
        new HttpExceptionContent(
          HttpStatus.UNAUTHORIZED,
          ['Incorrect username or password'],
          'Unauthorized',
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.generateTokens(user);
  }

  async refresh(refreshDto: RefreshDto) {
    const decodedAccessToken = this.jwtService.verify(refreshDto.accessToken, {
      ignoreExpiration: true,
    });
    const user = await this.usersService.findOneById(decodedAccessToken.id);
    if (
      !user ||
      !user.refreshToken ||
      !(await bcrypt.compare(refreshDto.refreshToken, user.refreshToken)) ||
      (user.bannedUntil && user.bannedUntil.getTime() > Date.now())
    ) {
      throw new HttpException(
        new HttpExceptionContent(
          HttpStatus.UNAUTHORIZED,
          ['Invalid tokens'],
          'Unauthorized',
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshToken = randomBytes(64).toString('hex');
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
    return {
      refreshToken: refreshToken,
      accessToken: this.jwtService.sign(
        Object.assign({}, new MyUserDto({ ...user })),
      ),
    };
  }

  async signOut(authUser: MyUserDto) {
    return await this.usersService.deleteRefreshToken(authUser.id);
  }
}
