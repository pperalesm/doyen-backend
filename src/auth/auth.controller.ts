import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Constants } from '../shared/constants';
import { HttpExceptionContent } from '../shared/models/http-exception-content';
import { User } from '../database/entities/user.entity';
import { AuthService } from './auth.service';
import { MyUserDto } from './dto/my-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return new MyUserDto({ ...user });
  }

  @UseGuards(AuthGuard(Constants.LOCAL_STRATEGY))
  @Post('signin')
  async signIn(@Body() user: User) {
    return user;
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('me')
  me() {
    return this.authService.me();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
