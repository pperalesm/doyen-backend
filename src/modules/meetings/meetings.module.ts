import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { CategoriesModule } from '../categories/categories.module';
import { Meeting } from '../../database/entities/meeting.entity';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { BidsModule } from '../bids/bids.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { CollaborationsModule } from '../collaborations/collaborations.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    NotificationsModule,
    CategoriesModule,
    BidsModule,
    PurchasesModule,
    CollaborationsModule,
    UsersModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
