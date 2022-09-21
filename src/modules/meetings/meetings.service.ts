import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoriesService } from '../categories/categories.service';
import { Meeting } from '../../database/entities/meeting.entity';
import { BidsService } from '../bids/bids.service';
import { PurchasesService } from '../purchases/purchases.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { CollaborationsService } from '../collaborations/collaborations.service';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { Category } from '../../database/entities/category.entity';
import { UsersService } from '../users/users.service';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepository: Repository<Meeting>,
    private readonly collaborationsService: CollaborationsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly bidsService: BidsService,
    private readonly purchasesService: PurchasesService,
  ) {}

  async createMeeting(
    authUser: AuthUserDto,
    createMeetingDto: CreateMeetingDto,
  ) {
    const [user, categories] = await Promise.all([
      this.usersService.findOneByIdWithCategories(authUser.id),
      createMeetingDto.categoryIds
        ? this.categoriesService.findAllById(createMeetingDto.categoryIds)
        : ([] as Category[]),
    ]);
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    let meeting = this.meetingsRepository.create({
      ...createMeetingDto,
      isAuction: false,
      creatorUser: user,
      categories: categories,
    });
    if (!createMeetingDto.collaborationsInfo) {
      meeting.publishedAt = new Date();
    }
    await this.dataSource.transaction(async (entityManager) => {
      meeting = await entityManager.getRepository(Meeting).save(meeting);
      if (createMeetingDto.collaborationsInfo) {
        meeting.collaborations = await this.collaborationsService.createMany(
          createMeetingDto.collaborationsInfo,
          meeting.id,
          entityManager,
        );
      }
    });
    return meeting;
  }
}
