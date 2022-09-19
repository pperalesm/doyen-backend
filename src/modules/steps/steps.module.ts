import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from '../../database/entities/step.entity';
import { StepsService } from './steps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  providers: [StepsService],
  exports: [StepsService],
})
export class StepsModule {}
