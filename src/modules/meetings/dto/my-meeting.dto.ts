import { Category } from '../../../database/entities/category.entity';
import { Meeting } from '../../../database/entities/meeting.entity';
import { MyMeetingCollaborationDto } from '../../collaborations/dto/my-meeting-collaboration.dto';

export class MyMeetingDto {
  id!: string;
  title!: string;
  isAuction!: boolean;
  basePrice!: number;
  maxParticipants!: number;
  duration!: number;
  nextIn?: number;
  createdAt!: Date;
  openedAt?: Date;
  phasedAt?: Date;
  closedAt?: Date;
  scheduledAt!: Date;
  cancelledAt?: Date;
  imageUrl?: string;
  description?: string;
  categories!: Category[];
  collaborations!: MyMeetingCollaborationDto[];

  constructor(meeting: Meeting) {
    this.id = meeting.id;
    this.title = meeting.title;
    this.isAuction = meeting.isAuction;
    this.basePrice = meeting.basePrice;
    this.maxParticipants = meeting.maxParticipants;
    this.duration = meeting.duration;
    this.nextIn = meeting.nextIn;
    this.createdAt = meeting.createdAt;
    this.openedAt = meeting.openedAt;
    this.phasedAt = meeting.phasedAt;
    this.closedAt = meeting.closedAt;
    this.scheduledAt = meeting.scheduledAt;
    this.cancelledAt = meeting.cancelledAt;
    this.imageUrl = meeting.imageUrl;
    this.description = meeting.description;
    this.categories = meeting.categories ? meeting.categories : [];
    this.collaborations = meeting.collaborations
      ? meeting.collaborations.map(
          (collaboration) => new MyMeetingCollaborationDto(collaboration),
        )
      : [];
  }
}
