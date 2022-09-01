import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MyUserDto } from './dto/my-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../shared/decorators/public.decorator';
import { LocalGuard } from '../shared/guards/local.guard';
import { SignInDto } from './dto/sign-in.dto';
import { AuthUser } from '../shared/decorators/auth-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return {
      accessToken: this.authService.signIn(user),
      user: new MyUserDto({ ...user }),
    };
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @AuthUser() authUser: User) {
    return {
      accessToken: this.authService.signIn(authUser),
      user: new MyUserDto({ ...authUser }),
    };
  }

  @Get('me')
  me(@AuthUser() authUser: User) {
    return new MyUserDto({ ...authUser });
  }
}
