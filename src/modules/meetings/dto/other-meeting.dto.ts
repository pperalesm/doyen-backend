import { Bid } from '../../../database/entities/bid.entity';
import { Category } from '../../../database/entities/category.entity';
import { Meeting } from '../../../database/entities/meeting.entity';
import { Purchase } from '../../../database/entities/purchase.entity';
import { MyMeetingCollaborationDto } from '../../collaborations/dto/my-meeting-collaboration.dto';
import { OtherMeetingCollaborationDto } from '../../collaborations/dto/other-meeting-collaboration.dto';
import { OtherUserDto } from '../../users/dto/other-user.dto';

export class OtherMeetingDto {
  id!: string;
  title!: string;
  isAuction!: boolean;
  basePrice!: number;
  maxParticipants!: number;
  duration!: number;
  openedAt?: Date;
  phasedAt?: Date;
  closedAt?: Date;
  scheduledAt!: Date;
  cancelledAt?: Date;
  imageUrl?: string;
  description?: string;
  categories!: Category[];
  collaborations!: OtherMeetingCollaborationDto[];

  constructor(meeting: Meeting) {
    this.id = meeting.id;
    this.title = meeting.title;
    this.isAuction = meeting.isAuction;
    this.basePrice = meeting.basePrice;
    this.maxParticipants = meeting.maxParticipants;
    this.duration = meeting.duration;
    this.openedAt = meeting.openedAt;
    this.phasedAt = meeting.phasedAt;
    this.closedAt = meeting.closedAt;
    this.scheduledAt = meeting.scheduledAt;
    this.cancelledAt = meeting.cancelledAt;
    this.imageUrl = meeting.imageUrl;
    this.categories = meeting.categories ? meeting.categories : [];
    this.collaborations = meeting.collaborations
      ? meeting.collaborations.map(
          (collaboration) => new OtherMeetingCollaborationDto(collaboration),
        )
      : [];
  }
}
