import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Step } from '../../database/entities/step.entity';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Step)
    private readonly stepsRepository: Repository<Step>,
  ) {}
}
