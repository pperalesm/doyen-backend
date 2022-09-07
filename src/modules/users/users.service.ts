import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18n, I18nService } from 'nestjs-i18n';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '../../database/entities/user.entity';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class UsersService {
  constructor(
    @I18n() private readonly i18n: I18nService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly emailService: MailerService,
  ) {}

  async create(signUpDto: SignUpDto) {
    const user = this.usersRepository.create({ ...signUpDto });
    return await this.dataSource.transaction(async (entityManager) => {
      const newUser = await entityManager.save(user);
      await this.emailService.sendMail({
        to: newUser.email,
        subject: this.i18n.t('auth.UserActivation', {
          lang: newUser.language,
        }),
        template: `${newUser.language}/user-activation`,
        context: {
          name: newUser.name || newUser.username,
          url: `doyen.app/auth/activate?token=sdf`,
        },
      });
      return newUser;
    });
  }

  async findOneById(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ id: id })
      .getOne();
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where([{ username: usernameOrEmail }, { email: usernameOrEmail }])
      .getOne();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: refreshToken })
      .where({ id: id })
      .execute();
  }

  async deleteRefreshToken(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: null })
      .where({ id: id })
      .execute();
  }

  async findAll(findAllDto: FindAllDto) {
    return await this.usersRepository
      .createQueryBuilder()
      .where({ isPublic: true })
      .orderBy({ gains: 'DESC' })
      .take(findAllDto?.take || 10)
      .skip(findAllDto?.skip)
      .getMany();
  }
}
