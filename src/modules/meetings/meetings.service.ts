import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoriesService } from '../categories/categories.service';
import { Meeting } from '../../database/entities/meeting.entity';
import { BidsService } from '../bids/bids.service';
import { PurchasesService } from '../purchases/purchases.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepository: Repository<Meeting>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
    private readonly categoriesService: CategoriesService,
    private readonly bidsService: BidsService,
    private readonly purchasesService: PurchasesService,
  ) {}
}
