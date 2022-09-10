import { Controller, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { MyUserDto } from './dto/my-user.dto';
import { ActivateDto } from './dto/activate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Public()
  @Patch('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto);
  }

  @Delete('signout')
  async signOut(@AuthUser() authUser: MyUserDto) {
    console.log(authUser);
    await this.authService.signOut(authUser);
  }

  @Public()
  @Patch('activate')
  async activate(@Query() activateDto: ActivateDto) {
    return await this.authService.activate(activateDto);
  }
}
