import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaboration } from '../../database/entities/collaboration.entity';
import { CollaborationsController } from './collaborations.controller';
import { CollaborationsService } from './collaborations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collaboration])],
  controllers: [CollaborationsController],
  providers: [CollaborationsService],
  exports: [CollaborationsService],
})
export class CollaborationsModule {}
