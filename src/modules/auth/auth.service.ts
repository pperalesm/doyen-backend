import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { randomBytes } from 'crypto';
import { RefreshDto } from './dto/refresh.dto';
import { ActivateDto } from './dto/activate.dto';
import { CustomUnauthorized } from '../../shared/exceptions/custom-unauthorized';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.usersService.createOne(signUpDto);
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
      throw new CustomUnauthorized(['Incorrect username or password']);
    }
    return await this.generateTokens(user);
  }

  async refresh(refreshDto: RefreshDto) {
    const { id } = this.verifyToken(refreshDto.accessToken, {
      ignoreExpiration: true,
    });
    const user = await this.usersService.findOneById(id);
    if (
      !user ||
      !user.refreshToken ||
      !(await bcrypt.compare(refreshDto.refreshToken, user.refreshToken)) ||
      (user.bannedUntil && user.bannedUntil.getTime() > Date.now())
    ) {
      throw new CustomUnauthorized(['Invalid tokens']);
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
        Object.assign({}, new AuthUserDto(user)),
        { expiresIn: '15m' },
      ),
    };
  }

  async signOut(authUser: AuthUserDto) {
    await this.usersService.deleteRefreshToken(authUser.id);
  }

  async activate(activateDto: ActivateDto) {
    const { id } = this.verifyToken(activateDto.token);
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    await this.usersService.activate(id);
    user.isActive = true;
    return await this.generateTokens(user);
  }

  async resendActivationEmail(authUser: AuthUserDto) {
    const user = await this.usersService.findOneById(authUser.id);
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    await this.notificationsService.userActivation(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findOneByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    this.notificationsService.forgotPassword(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { id } = this.verifyToken(resetPasswordDto.token);
    const password = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.usersService.updatePassword(id, password);
  }

  async changePassword(
    authUser: AuthUserDto,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOneById(authUser.id);
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    if (
      !user.password ||
      !(await bcrypt.compare(changePasswordDto.oldPassword, user.password))
    ) {
      throw new CustomUnauthorized(['Incorrect password']);
    }
    const password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.updatePassword(authUser.id, password);
  }

  verifyToken(token: string, verifyOptions?: JwtVerifyOptions) {
    try {
      return this.jwtService.verify(token, verifyOptions);
    } catch (e) {
      throw new CustomUnauthorized(['Invalid token']);
    }
  }
}
