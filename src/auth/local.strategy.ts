import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isHashEqual } from '../util/hashing';
import { UsersService } from '../users/users.service';
import { HttpExceptionContent } from '../shared/models/http-exception-content';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user || !(await isHashEqual(password, user.password))) {
      throw new HttpException(
        new HttpExceptionContent(
          HttpStatus.UNAUTHORIZED,
          ['Incorrect username or password'],
          'Unauthorized',
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
