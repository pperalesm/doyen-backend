import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HttpExceptionContent } from '../shared/models/http-exception-content';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.NODE_ENV == 'development',
      secretOrKey: process.env.JWT_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (
      !user ||
      (user.bannedUntil && user.bannedUntil.getTime() > Date.now())
    ) {
      throw new HttpException(
        new HttpExceptionContent(
          HttpStatus.UNAUTHORIZED,
          ['User not allowed'],
          'Unauthorized',
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
