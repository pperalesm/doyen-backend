import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '../../database/entities/purchase.entity';
import { MeetingsModule } from '../meetings/meetings.module';
import { UsersModule } from '../users/users.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase]), UsersModule, MeetingsModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
