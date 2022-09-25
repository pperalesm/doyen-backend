import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';

@Entity('collaborations')
@Index(['userId', 'meetingId'], { unique: true })
export class Collaboration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  percentage!: number;

  @Column({ nullable: true })
  isAccepted?: boolean;

  @ManyToOne(() => User, (user) => user.collaborations)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.collaborations)
  meeting!: Meeting;

  @Column()
  meetingId!: string;
}
