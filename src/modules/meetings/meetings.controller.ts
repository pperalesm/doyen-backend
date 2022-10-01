import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Active } from '../../shared/decorators/active.decorator';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { CustomBadRequest } from '../../shared/exceptions/custom-bad-request';
import { CustomForbidden } from '../../shared/exceptions/custom-forbidden';
import { CustomNotFound } from '../../shared/exceptions/custom-not-found';
import { Constants } from '../../shared/util/constants';
import { PagingDto } from '../../shared/util/paging.dto';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { FindAllMeetingsDto } from './dto/find-all-meetings.dto';
import { MyMeetingDto } from './dto/my-meeting.dto';
import { OtherMeetingDto } from './dto/other-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  async findAll(@Query() findAllMeetingsDto: FindAllMeetingsDto) {
    const meetings = await this.meetingsService.findAll(findAllMeetingsDto);
    return meetings.map((meeting) => new OtherMeetingDto(meeting));
  }

  @Get('followed')
  async followed(
    @AuthUser() authUser: AuthUserDto,
    @Query() pagingDto: PagingDto,
  ) {
    const meetings = await this.meetingsService.followed(authUser, pagingDto);
    return meetings.map((meeting) => new OtherMeetingDto(meeting));
  }

  @Get('mine')
  async mine(@AuthUser() authUser: AuthUserDto, @Query() pagingDto: PagingDto) {
    const meetings = await this.meetingsService.mine(authUser, pagingDto);
    return meetings.map((meeting) => new MyMeetingDto(meeting));
  }

  @Active()
  @Post()
  async create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    const validationErrors: string[] = [];
    if (createMeetingDto.collaborationsInfo?.length) {
      if (
        createMeetingDto.collaborationsInfo.length +
          createMeetingDto.maxParticipants >
        Constants.PARTICIPANTS_MAX
      ) {
        validationErrors.push(Constants.PARTICIPANTS_INVALID_MESSAGE);
      }
      let percentageSum = 0;
      for (const collaboration of createMeetingDto.collaborationsInfo) {
        if (collaboration.email === authUser.email) {
          validationErrors.push(Constants.COLLABORATION_INVALID_MESSAGE);
        }
        percentageSum += collaboration.percentage;
      }
      if (percentageSum > 100) {
        validationErrors.push(
          Constants.COLLABORATION_PERCENTAGE_INVALID_MESSAGE,
        );
      }
    }
    if (
      createMeetingDto.isAuction &&
      createMeetingDto.scheduledAt.getTime() - Constants.OPENED_AT_DAYS <=
        Date.now()
    ) {
      validationErrors.push(Constants.SCHEDULED_AT_AUCTION_INVALID_MESSAGE);
    } else if (createMeetingDto.scheduledAt.getTime() <= Date.now()) {
      validationErrors.push(Constants.SCHEDULED_AT_INVALID_MESSAGE);
    }
    if (validationErrors.length > 0) {
      throw new CustomBadRequest(validationErrors);
    }
    const meeting = await this.meetingsService.createOne(
      authUser,
      createMeetingDto,
    );
    return new MyMeetingDto(meeting);
  }

  @Patch(':id/cancel')
  async cancel(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    let meeting = await this.meetingsService.findOneById(id);
    if (!meeting) {
      throw new CustomNotFound(['Meeting not found']);
    }
    if (meeting.creatorUserId !== authUser.id) {
      throw new CustomForbidden(['Access to resource not authorized']);
    }
    meeting = await this.meetingsService.cancel(id);
    return new MyMeetingDto(meeting);
  }

  @Patch(':id/follow')
  async follow(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    await this.meetingsService.follow(authUser, id);
  }

  @Patch(':id/unfollow')
  async unfollow(@AuthUser() authUser: AuthUserDto, @Param('id') id: string) {
    await this.meetingsService.unfollow(authUser, id);
  }

  @Patch(':id')
  async updateOne(
    @AuthUser() authUser: AuthUserDto,
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    let meeting = await this.meetingsService.findOneById(id);
    if (!meeting) {
      throw new CustomNotFound(['Meeting not found']);
    }
    if (meeting.creatorUserId !== authUser.id) {
      throw new CustomForbidden(['Access to resource not authorized']);
    }
    meeting = await this.meetingsService.updateOne(id, updateMeetingDto);
    return new MyMeetingDto(meeting);
  }
}
