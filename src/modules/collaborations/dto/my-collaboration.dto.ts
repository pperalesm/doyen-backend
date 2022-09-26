import { Collaboration } from '../../../database/entities/collaboration.entity';
import { OtherMeetingDto } from '../../meetings/dto/other-meeting.dto';

export class MyCollaborationDto {
  id!: string;
  percentage!: number;
  isAccepted?: boolean;
  meeting!: OtherMeetingDto;

  constructor(collaboration: Collaboration) {
    this.id = collaboration.id;
    this.percentage = collaboration.percentage;
    this.isAccepted = collaboration.isAccepted;
    this.meeting = new OtherMeetingDto(collaboration.meeting);
  }
}
