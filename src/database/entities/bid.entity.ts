import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { Step } from './step.entity';
import { User } from './user.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float' })
  amount!: number;

  @ManyToOne(() => User, (user) => user.bids)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.bids)
  meeting!: Meeting;

  @Column()
  meetingId!: string;

  @OneToMany(() => Step, (step) => step.bid)
  steps!: Step[];
}
