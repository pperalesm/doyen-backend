import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { HttpExceptionContent } from '../shared/models/http-exception-content';
import { AuthService } from './auth.service';
import { MyUserDto } from './dto/my-user.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return new MyUserDto({ ...user });
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
