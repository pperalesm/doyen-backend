import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Purchase } from '../../database/entities/purchase.entity';
import { CustomBadRequest } from '../../shared/exceptions/custom-bad-request';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { MeetingsService } from '../meetings/meetings.service';
import { UsersService } from '../users/users.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly usersService: UsersService,
    private readonly meetingsService: MeetingsService,
    private readonly dataSource: DataSource,
  ) {}

  async createOne(authUser: AuthUserDto, createPurchaseDto: CreatePurchaseDto) {
    const [user, meeting] = await Promise.all([
      this.usersService.findOneById(authUser.id),
      this.meetingsService.findOneByIdWithAttendeeUsers(
        createPurchaseDto.meetingId,
      ),
    ]);
    if (!user) {
      throw new CustomNotFound(['User not found']);
    }
    if (!meeting) {
      throw new CustomNotFound(['Meeting not found']);
    }
    if (meeting.creatorUserId === user.id) {
      throw new CustomBadRequest(['You cannot purchase your own meeting']);
    }
    if (meeting.isAuction) {
      throw new CustomBadRequest([
        'You cannot purchase an auction based meeting',
      ]);
    }
    if (meeting.cancelledAt) {
      throw new CustomBadRequest(['You cannot purchase a cancelled meeting']);
    }
    if (meeting.scheduledAt.getTime() < Date.now()) {
      throw new CustomBadRequest(['You cannot purchase a past meeting']);
    }
    if (meeting.attendeeUsers.length >= meeting.maxParticipants) {
      throw new CustomBadRequest(['You cannot purchase a full meeting']);
    }
    let purchase = this.purchasesRepository.create({
      ...createPurchaseDto,
      userId: user.id,
    });
    await this.dataSource.transaction(async (entityManager) => {
      [, purchase] = await Promise.all([
        this.usersService.attendMeeting(
          user.id,
          meeting.id,
          meeting.basePrice,
          entityManager,
        ),
        entityManager.getRepository(Purchase).save(purchase),
      ]);
    });
    return purchase;
  }
}
