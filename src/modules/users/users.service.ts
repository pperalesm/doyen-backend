import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '../../database/entities/user.entity';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../../database/entities/category.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(signUpDto: SignUpDto) {
    let categories: Category[] = [];
    if (signUpDto.categoryIds) {
      categories = await this.categoriesService.findAllById(
        signUpDto.categoryIds,
      );
    }
    let user = this.usersRepository.create({
      ...signUpDto,
      categories: categories,
    });
    return await this.dataSource.transaction(async (entityManager) => {
      user = await entityManager.save(user);
      await this.notificationsService.userActivation(user);
      return user;
    });
  }

  async findOneById(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.id = :id', { id: id })
      .getOne();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where('User.email = :email', { email: email })
      .getOne();
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.categories', 'Category')
      .where(
        'User.username = :usernameOrEmail OR User.email = :usernameOrEmail',
        {
          usernameOrEmail: usernameOrEmail,
        },
      )
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

  async findAll(findAllUsersDto: FindAllUsersDto) {
    if (findAllUsersDto.categoryIds && findAllUsersDto.categoryIds.length > 0) {
      return await this.usersRepository
        .createQueryBuilder()
        .leftJoinAndSelect('User.categories', 'CategoryToSelect')
        .leftJoin('User.categories', 'Category')
        .where('User.isPublic = true AND Category.id IN (:...categoryIds)', {
          categoryIds: findAllUsersDto.categoryIds,
        })
        .groupBy('User.id, CategoryToSelect.id')
        .having('Count(*) = :numCategories', {
          numCategories: findAllUsersDto.categoryIds?.length,
        })
        .orderBy('User.gains', 'DESC')
        .take(findAllUsersDto?.take || 10)
        .skip(findAllUsersDto?.skip)
        .getMany();
    } else {
      return await this.usersRepository
        .createQueryBuilder()
        .leftJoinAndSelect('User.categories', 'Category')
        .where('User.isPublic = true')
        .orderBy('User.gains', 'DESC')
        .take(findAllUsersDto?.take || 10)
        .skip(findAllUsersDto?.skip)
        .getMany();
    }
  }

  async activate(id: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where({ id: id })
      .execute();
  }

  async updatePassword(id: string, password: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ password: password })
      .where({ id: id })
      .execute();
  }
}
