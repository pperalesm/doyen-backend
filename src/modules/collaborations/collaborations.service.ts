import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaboration } from '../../database/entities/collaboration.entity';

@Injectable()
export class CollaborationsService {
  constructor(
    @InjectRepository(Collaboration)
    private readonly collaborationsRepository: Repository<Collaboration>,
  ) {}
}
