import { Collaboration } from '../../../database/entities/collaboration.entity';
import { OtherUserDto } from '../../users/dto/other-user.dto';

export class OtherMeetingCollaborationDto {
  id!: string;
  isAccepted?: boolean;
  user!: OtherUserDto;

  constructor(collaboration: Collaboration) {
    this.id = collaboration.id;
    this.isAccepted = collaboration.isAccepted;
    this.user = new OtherUserDto(collaboration.user);
  }
}
