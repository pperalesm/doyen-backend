import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { MyUserDto } from './dto/my-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: process.env.NODE_ENV == 'development',
      secretOrKey: process.env.JWT_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    return new MyUserDto({ ...payload });
  }
}
