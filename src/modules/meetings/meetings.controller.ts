import { Body, Controller, Post } from '@nestjs/common';
import { Active } from '../../shared/decorators/active.decorator';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { CustomBadRequest } from '../../shared/exceptions/custom-bad-request';
import { Constants } from '../../shared/util/constants';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MyMeetingDto } from './dto/my-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Active()
  @Post()
  async createOne(
    @AuthUser() authUser: AuthUserDto,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    const validationErrors: string[] = [];
    if (createMeetingDto.collaborationsInfo) {
      if (
        createMeetingDto.collaborationsInfo.length +
          createMeetingDto.maxParticipants >
        Constants.PARTICIPANTS_MAX
      ) {
        validationErrors.push(Constants.PARTICIPANTS_INVALID_MESSAGE);
      }
      let percentageSum = 0;
      for (const collaboration of createMeetingDto.collaborationsInfo) {
        if (collaboration.userId === authUser.id) {
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
    if (createMeetingDto.scheduledAt.getTime() <= Date.now()) {
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
}
