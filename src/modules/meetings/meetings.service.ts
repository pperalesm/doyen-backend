import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Meeting } from '../../database/entities/meeting.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { CollaborationsService } from '../collaborations/collaborations.service';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CustomInternalServerError } from '../../shared/exceptions/custom-internal-server-error';

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
    if (createMeetingDto.categoryIds) {
      meeting.categories = await this.categoriesService.findAllById(
        createMeetingDto.categoryIds,
      );
    }
    if (createMeetingDto.isAuction) {
      const msInDay = 1000 * 60 * 60 * 24;
      meeting.openedAt = new Date(meeting.scheduledAt.getTime() - msInDay * 3);
      meeting.phasedAt = new Date(meeting.scheduledAt.getTime() - msInDay * 2);
      meeting.closedAt = new Date(meeting.scheduledAt.getTime() - msInDay * 1);
    }
    if (!createMeetingDto.collaborationsInfo) {
      meeting.publishedAt = new Date();
    }
    await this.dataSource.transaction(async (entityManager) => {
      meeting = await entityManager.getRepository(Meeting).save(meeting);
      if (createMeetingDto.collaborationsInfo) {
        await this.collaborationsService.createMany(
          createMeetingDto.collaborationsInfo,
          meeting.id,
          entityManager,
        );
      }
    });
    let query = this.meetingsRepository.createQueryBuilder();
    if (
      createMeetingDto.categoryIds &&
      createMeetingDto.categoryIds.length > 0
    ) {
      query = query.leftJoinAndSelect('Meeting.categories', 'Category');
    }
    if (
      createMeetingDto.collaborationsInfo &&
      createMeetingDto.collaborationsInfo.length > 0
    ) {
      query = query
        .leftJoinAndSelect('Meeting.collaborations', 'Collaboration')
        .leftJoinAndSelect('Collaboration.user', 'CollaborationUser')
        .leftJoinAndSelect(
          'CollaborationUser.categories',
          'CollaborationUserCategory',
        );
    }
    const newMeeting = await query
      .where('Meeting.id = :id', { id: meeting.id })
      .getOne();
    if (!newMeeting) {
      throw new CustomInternalServerError();
    }
    return newMeeting;
  }
}
