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
import { FindAllMeetingsDto } from './dto/find-all-meetings.dto';
import { PagingDto } from '../../shared/util/paging.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

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

  async fromFollowed(authUser: AuthUserDto, pagingDto: PagingDto) {
    return await this.meetingsRepository
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
      .leftJoin('CreatorUser.followerUsers', 'CreatorUserFollower')
      .leftJoin('CollaborationUser.followerUsers', 'CollaborationUserFollower')
      .where(
        '(CreatorUserFollower.id = :id OR CollaborationUserFollower.id = :id)',
        { id: authUser.id },
      )
      .andWhere('Meeting.cancelledAt IS NULL')
      .andWhere(
        '(Meeting.isAuction = true AND Meeting.closedAt > :now OR Meeting.isAuction = false AND Meeting.scheduledAt > :now)',
        { now: new Date() },
      )
      .orderBy('Meeting.scheduledAt', 'ASC')
      .take(pagingDto?.take || 10)
      .skip(pagingDto?.skip)
      .getMany();
  }

  async followed(authUser: AuthUserDto, pagingDto: PagingDto) {
    return await this.meetingsRepository
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
      .leftJoin('Meeting.followerUsers', 'Follower')
      .where('Follower.id = :id', { id: authUser.id })
      .andWhere('Meeting.cancelledAt IS NULL')
      .andWhere(
        '(Meeting.isAuction = true AND Meeting.closedAt > :now OR Meeting.isAuction = false AND Meeting.scheduledAt > :now)',
        { now: new Date() },
      )
      .orderBy('Meeting.scheduledAt', 'ASC')
      .take(pagingDto?.take || 10)
      .skip(pagingDto?.skip)
      .getMany();
  }

  async follow(authUser: AuthUserDto, id: string) {
    await this.meetingsRepository
      .createQueryBuilder()
      .relation('followerUsers')
      .of(id)
      .add(authUser.id);
  }

  async unfollow(authUser: AuthUserDto, id: string) {
    await this.meetingsRepository
      .createQueryBuilder()
      .relation('followerUsers')
      .of(id)
      .remove(authUser.id);
  }

  async cancel(id: string) {
    await this.meetingsRepository
      .createQueryBuilder()
      .update()
      .set({ cancelledAt: new Date() })
      .where({ id: id })
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
      .getOne();
    if (!updatedMeeting) {
      throw new CustomInternalServerError();
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
    if (findAllMeetingsDto.minBasePrice) {
      query = query.andWhere('Meeting.basePrice >= :minBasePrice', {
        minBasePrice: findAllMeetingsDto.minBasePrice,
      });
    }
    if (findAllMeetingsDto.maxBasePrice) {
      query = query.andWhere('Meeting.basePrice <= :maxBasePrice', {
        maxBasePrice: findAllMeetingsDto.maxBasePrice,
      });
    }
    if (findAllMeetingsDto.minMaxParticipants) {
      query = query.andWhere('Meeting.maxParticipants >= :minMaxParticipants', {
        minMaxParticipants: findAllMeetingsDto.minMaxParticipants,
      });
    }
    if (findAllMeetingsDto.maxMaxParticipants) {
      query = query.andWhere('Meeting.maxParticipants <= :maxMaxParticipants', {
        maxMaxParticipants: findAllMeetingsDto.maxMaxParticipants,
      });
    }
    if (findAllMeetingsDto.minDuration) {
      query = query.andWhere('Meeting.duration >= :minDuration', {
        minDuration: findAllMeetingsDto.minDuration,
      });
    }
    if (findAllMeetingsDto.maxDuration) {
      query = query.andWhere('Meeting.duration <= :maxDuration', {
        maxDuration: findAllMeetingsDto.maxDuration,
      });
    }
    if (findAllMeetingsDto.minScheduledAt) {
      query = query.andWhere('Meeting.scheduledAt >= :minScheduledAt', {
        minScheduledAt: findAllMeetingsDto.minScheduledAt,
      });
    }
    if (findAllMeetingsDto.maxScheduledAt) {
      query = query.andWhere('Meeting.scheduledAt <= :maxScheduledAt', {
        maxScheduledAt: findAllMeetingsDto.maxScheduledAt,
      });
    }
    return await query
      .orderBy('Meeting.scheduledAt', 'ASC')
      .take(findAllMeetingsDto?.take || 10)
      .skip(findAllMeetingsDto?.skip)
      .getMany();
  }

  async mine(authUser: AuthUserDto, pagingDto: PagingDto) {
    return await this.meetingsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meeting.categories', 'Category')
      .leftJoinAndSelect('Meeting.collaborations', 'Collaboration')
      .leftJoinAndSelect('Collaboration.user', 'CollaborationUser')
      .leftJoinAndSelect(
        'CollaborationUser.categories',
        'CollaborationUserCategory',
      )
      .where('Meeting.creatorUserId = :id', { id: authUser.id })
      .andWhere('Meeting.cancelledAt IS NULL')
      .andWhere('Meeting.scheduledAt > :now', { now: new Date() })
      .orderBy('Meeting.scheduledAt', 'ASC')
      .take(pagingDto?.take || 10)
      .skip(pagingDto?.skip)
      .getMany();
  }

  async updateOne(id: string, updateMeetingDto: UpdateMeetingDto) {
    let meeting = this.meetingsRepository.create({
      id: id,
      ...updateMeetingDto,
    });
    await this.dataSource.transaction(async (entityManager) => {
      if (updateMeetingDto.categoryNames?.length) {
        meeting.categories = await this.categoriesService.findOrCreate(
          updateMeetingDto.categoryNames,
          entityManager,
        );
      }
      meeting = await entityManager.getRepository(Meeting).save(meeting);
    });
    const updatedMeeting = await this.meetingsRepository
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
    if (!updatedMeeting) {
      throw new CustomInternalServerError();
    }
    return updatedMeeting;
  }

  async findOneById(id: string) {
    return await this.meetingsRepository
      .createQueryBuilder()
      .where('Meeting.id = :id', {
        id: id,
      })
      .getOne();
  }
}
