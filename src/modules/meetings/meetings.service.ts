import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Meeting } from '../../database/entities/meeting.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { CollaborationsService } from '../collaborations/collaborations.service';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CustomInternalServerError } from '../../shared/exceptions/custom-internal-server-error';
import { Constants } from '../../shared/util/constants';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
import { FindAllMeetingsDto } from './dto/find-all-meetings.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepository: Repository<Meeting>,
    private readonly collaborationsService: CollaborationsService,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
  ) {}

  async createOne(authUser: AuthUserDto, createMeetingDto: CreateMeetingDto) {
    let meeting = this.meetingsRepository.create({
      ...createMeetingDto,
      creatorUserId: authUser.id,
    });
    if (createMeetingDto.isAuction) {
      const msInDay = 1000 * 60 * 60 * 24;
      meeting.openedAt = new Date(
        meeting.scheduledAt.getTime() - msInDay * Constants.OPENED_AT_DAYS,
      );
      meeting.phasedAt = new Date(
        meeting.scheduledAt.getTime() - msInDay * Constants.PHASED_AT_DAYS,
      );
      meeting.closedAt = new Date(
        meeting.scheduledAt.getTime() - msInDay * Constants.CLOSED_AT_DAYS,
      );
    }
    await this.dataSource.transaction(async (entityManager) => {
      if (createMeetingDto.categoryNames?.length) {
        meeting.categories = await this.categoriesService.findOrCreate(
          createMeetingDto.categoryNames,
          entityManager,
        );
      }
      meeting = await entityManager.getRepository(Meeting).save(meeting);
      if (createMeetingDto.collaborationsInfo?.length) {
        await this.collaborationsService.createMany(
          createMeetingDto.collaborationsInfo,
          meeting.id,
          entityManager,
        );
      }
    });
    const newMeeting = await this.meetingsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meeting.categories', 'Category')
      .leftJoinAndSelect('Meeting.collaborations', 'Collaboration')
      .leftJoinAndSelect('Collaboration.user', 'CollaborationUser')
      .leftJoinAndSelect(
        'CollaborationUser.categories',
        'CollaborationUserCategory',
      )
      .where('Meeting.id = :id', { id: meeting.id })
      .getOne();
    if (!newMeeting) {
      throw new CustomInternalServerError();
    }
    return newMeeting;
  }

  async cancel(authUser: AuthUserDto, id: string) {
    await this.meetingsRepository
      .createQueryBuilder()
      .update()
      .set({ cancelledAt: new Date() })
      .where({ id: id, creatorUserId: authUser.id })
      .execute();
    const updatedMeeting = await this.meetingsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meeting.categories', 'Category')
      .leftJoinAndSelect('Meeting.collaborations', 'Collaboration')
      .leftJoinAndSelect('Collaboration.user', 'CollaborationUser')
      .leftJoinAndSelect(
        'CollaborationUser.categories',
        'CollaborationUserCategory',
      )
      .where('Meeting.id = :meetingId', { meetingId: id })
      .andWhere('Meeting.creatorUserId = :userId', { userId: authUser.id })
      .getOne();
    if (!updatedMeeting) {
      throw new CustomNotFound(['Meeting not found']);
    }
    return updatedMeeting;
  }

  async findAll(findAllMeetingsDto: FindAllMeetingsDto) {
    let query = this.meetingsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meeting.categories', 'Category')
      .leftJoinAndSelect('Meeting.creatorUser', 'CreatorUser')
      .leftJoinAndSelect('CreatorUser.categories', 'CreatorUserCategory')
      .leftJoinAndSelect('Meeting.collaborations', 'Collaboration')
      .leftJoinAndSelect('Collaboration.user', 'CollaborationUser')
      .leftJoinAndSelect(
        'CollaborationUser.categories',
        'CollaborationUserCategory',
      )
      .where('Meeting.cancelledAt IS NULL')
      .andWhere(
        '(Meeting.isAuction = true AND Meeting.closedAt > :now OR Meeting.isAuction = false AND Meeting.scheduledAt > :now)',
        { now: new Date() },
      );
    if (findAllMeetingsDto.isAuction !== undefined) {
      query = query.andWhere('Meeting.isAuction = :isAuction', {
        isAuction: findAllMeetingsDto.isAuction,
      });
    }
    if (findAllMeetingsDto.userId) {
      query = query.andWhere(
        '(CreatorUser.id = :userId OR CollaborationUser.id = :userId)',
        {
          userId: findAllMeetingsDto.userId,
        },
      );
    }
    if (findAllMeetingsDto.categoryIds?.length) {
      query = query
        .leftJoin('Meeting.categories', 'AuxCategory')
        .andWhere('AuxCategory.id IN (:...categoryIds)', {
          categoryIds: findAllMeetingsDto.categoryIds,
        })
        .groupBy(
          'Meeting.id, Collaboration.id, CollaborationUser.id, CollaborationUserCategory.id, CreatorUser.id, CreatorUserCategory.id, Category.id',
        )
        .having('Count(*) = :numCategories', {
          numCategories: findAllMeetingsDto.categoryIds?.length,
        });
    }
    return await query
      .orderBy('Meeting.scheduledAt', 'ASC')
      .take(findAllMeetingsDto?.take || 10)
      .skip(findAllMeetingsDto?.skip)
      .getMany();
  }
}
