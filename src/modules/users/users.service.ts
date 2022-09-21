import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '../../database/entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoriesService } from '../categories/categories.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findOne(id: string) {
    const user = await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.id = :id', { id: id })
      .getOne();
    if (!user || !user.isPublic) {
      throw new CustomNotFound(['User not found']);
    }
    return user;
  }

  async findAll(findAllUsersDto: FindAllUsersDto) {
    let query = this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.isPublic = true');
    if (findAllUsersDto.categoryIds && findAllUsersDto.categoryIds.length > 0) {
      query = query
        .leftJoin('User.categories', 'AuxCategory')
        .andWhere('AuxCategory.id IN (:...categoryIds)', {
          categoryIds: findAllUsersDto.categoryIds,
        })
        .groupBy('User.id, Category.id')
        .having('Count(*) = :numCategories', {
          numCategories: findAllUsersDto.categoryIds?.length,
        });
    }
    return await query
      .orderBy('User.gains', 'DESC')
      .take(findAllUsersDto?.take || 10)
      .skip(findAllUsersDto?.skip)
      .getMany();
  }

  async follow(authUser: AuthUserDto, id: string) {
    await this.usersRepository
      .createQueryBuilder()
      .relation('followed')
      .of(authUser.id)
      .add(id);
  }

  async unfollow(authUser: AuthUserDto, id: string) {
    await this.usersRepository
      .createQueryBuilder()
      .relation('followed')
      .of(authUser.id)
      .remove(id);
  }

  async me(authUser: AuthUserDto) {
    const user = await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.id = :id', { id: authUser.id })
      .getOne();
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    return user;
  }

  async followers(authUser: AuthUserDto) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoin('User.followedUsers', 'Followed')
      .where('Followed.id = :id', { id: authUser.id })
      .getMany();
  }

  async followed(authUser: AuthUserDto) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoin('User.followerUsers', 'Follower')
      .where('Follower.id = :id', { id: authUser.id })
      .getMany();
  }

  async updateMe(authUser: AuthUserDto, updateMeDto: UpdateMeDto) {
    const user = await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.id = :id', { id: authUser.id })
      .getOne();
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    if (updateMeDto.categoryIds) {
      user.categories = await this.categoriesService.findAllById(
        updateMeDto.categoryIds,
      );
    }
    return await this.usersRepository.save(user);
  }

  async createOne(signUpDto: SignUpDto) {
    let user = this.usersRepository.create(signUpDto);
    if (signUpDto.categoryIds) {
      user.categories = await this.categoriesService.findAllById(
        signUpDto.categoryIds,
      );
    }
    user = await this.usersRepository.save(user);
    this.notificationsService.userActivation(user);
    return user;
  }

  async findOneById(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where('User.id = :id', { id: id })
      .getOne();
  }

  async findOneByIdWithCategories(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.id = :id', { id: id })
      .getOne();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where('User.email = :email', { email: email })
      .getOne();
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .where(
        'User.username = :usernameOrEmail OR User.email = :usernameOrEmail',
        {
          usernameOrEmail: usernameOrEmail,
        },
      )
      .getOne();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: refreshToken })
      .where({ id: id })
      .execute();
  }

  async deleteRefreshToken(id: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ refreshToken: null })
      .where({ id: id })
      .execute();
  }

  async activate(id: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where({ id: id })
      .execute();
  }

  async updatePassword(id: string, password: string) {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ password: password })
      .where({ id: id })
      .execute();
  }
}
