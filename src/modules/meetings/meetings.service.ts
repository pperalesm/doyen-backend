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
    if (
      createMeetingDto.categoryIds &&
      createMeetingDto.categoryIds.length > 0
    ) {
      meeting.categories = await this.categoriesService.findAllById(
        createMeetingDto.categoryIds,
      );
    }
    await this.dataSource.transaction(async (entityManager) => {
      meeting = await entityManager.getRepository(Meeting).save(meeting);
      if (
        createMeetingDto.collaborationsInfo &&
        createMeetingDto.collaborationsInfo.length > 0
      ) {
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
}
