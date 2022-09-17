import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { I18n, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @I18n() private readonly i18n: I18nService,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly emailService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async userActivation(user: User) {
    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '24h' });
    await this.emailService.sendMail({
      to: user.email,
      subject: this.i18n.t('auth.UserActivation', {
        lang: user.language,
      }),
      template: `${user.language}/user-activation`,
      context: {
        name: user.name || user.username,
        url: `doyen.app/auth/activate?token=${token}`,
      },
    });
  }

  async forgotPassword(user: User) {
    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '15m' });
    await this.emailService.sendMail({
      to: user.email,
      subject: this.i18n.t('auth.PasswordReset', {
        lang: user.language,
      }),
      template: `${user.language}/password-reset`,
      context: {
        name: user.name || user.username,
        url: `doyen.app/auth/password-reset?token=${token}`,
      },
    });
  }
}
