import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Collaboration } from '../../database/entities/collaboration.entity';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
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
}
