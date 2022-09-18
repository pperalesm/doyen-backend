import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.purchases)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.purchases)
  meeting!: Meeting;

  @Column()
  meetingId!: string;
}
