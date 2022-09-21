import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Collaboration } from '../../database/entities/collaboration.entity';
import { CollaborationDto } from '../meetings/dto/collaboration.dto';

@Injectable()
export class CollaborationsService {
  constructor(
    @InjectRepository(Collaboration)
    private readonly collaborationsRepository: Repository<Collaboration>,
  ) {}

  async createMany(
    collaborationsInfo: CollaborationDto[],
    meetingId: string,
    entityManager: EntityManager,
  ) {
    const collaborations = this.collaborationsRepository.create(
      collaborationsInfo.map((collaborationInfo) => ({
        ...collaborationInfo,
        meetingId: meetingId,
      })),
    );
    return await entityManager
      .getRepository(Collaboration)
      .save(collaborations);
  }
}
