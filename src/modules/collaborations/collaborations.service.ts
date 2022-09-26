import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Collaboration } from '../../database/entities/collaboration.entity';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
import { PagingDto } from '../../shared/util/paging.dto';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { UsersService } from '../users/users.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';

@Injectable()
export class CollaborationsService {
  constructor(
    @InjectRepository(Collaboration)
    private readonly collaborationsRepository: Repository<Collaboration>,
    private readonly usersService: UsersService,
  ) {}

  async createMany(
    collaborationsInfo: CreateCollaborationDto[],
    meetingId: string,
    entityManager: EntityManager,
  ) {
    const collaborations = this.collaborationsRepository.create(
      await Promise.all(
        collaborationsInfo.map(async (collaborationInfo) => {
          const user = await this.usersService.findOneByEmail(
            collaborationInfo.email,
          );
          if (!user) {
            throw new CustomNotFound([
              `User with email ${collaborationInfo.email} not found`,
            ]);
          }
          return {
            ...collaborationInfo,
            meetingId: meetingId,
            userId: user.id,
          };
        }),
      ),
    );
    await entityManager.getRepository(Collaboration).save(collaborations);
  }

  async findAll(authUser: AuthUserDto, pagingDto: PagingDto) {
    return await this.collaborationsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Collaboration.meeting', 'Meeting')
      .leftJoinAndSelect('Meeting.categories', 'MeetingCategory')
      .leftJoinAndSelect('Meeting.collaborations', 'MeetingCollaboration')
      .leftJoinAndSelect(
        'MeetingCollaboration.user',
        'MeetingCollaborationUser',
      )
      .leftJoinAndSelect(
        'MeetingCollaborationUser.categories',
        'MeetingCollaborationUserCategory',
      )
      .leftJoin('Collaboration.user', 'User')
      .where('User.id = :id', { id: authUser.id })
      .andWhere('Meeting.cancelledAt IS NULL')
      .andWhere('Meeting.scheduledAt > :now', { now: new Date() })
      .orderBy('Meeting.createdAt', 'DESC')
      .take(pagingDto?.take || 10)
      .skip(pagingDto?.skip)
      .getMany();
  }
}
