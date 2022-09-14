import { Controller, Post, Body, Patch, Delete, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { MyUserDto } from './dto/my-user.dto';
import { ActivateDto } from './dto/activate.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';
import { UpdateInfoDto } from './dto/update-info.dto';

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
    await this.authService.signOut(authUser);
  }

  @Public()
  @Patch('activate')
  async activate(@Body() activateDto: ActivateDto) {
    return await this.authService.activate(activateDto);
  }

  @Get('resend-activation-email')
  async resendActivationEmail(@AuthUser() authUser: MyUserDto) {
    await this.authService.resendActivationEmail(authUser);
  }

  @Public()
  @Throttle(1, 60 * 60 * 24)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('change-password')
  async changePassword(
    @AuthUser() authUser: MyUserDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(authUser, changePasswordDto);
  }

  @Patch('update-info')
  async updateInfo(
    @AuthUser() authUser: MyUserDto,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    return await this.authService.updateInfo(authUser, updateInfoDto);
  }
}
