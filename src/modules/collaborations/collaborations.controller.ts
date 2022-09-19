import { Controller, Get } from '@nestjs/common';
import { CollaborationsService } from './collaborations.service';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collaborationsService: CollaborationsService) {}

  @Get()
  async findAll() {
    return;
  }
}
