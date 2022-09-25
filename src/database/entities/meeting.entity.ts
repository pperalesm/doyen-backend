import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from './bid.entity';
import { Category } from './category.entity';
import { Collaboration } from './collaboration.entity';
import { Purchase } from './purchase.entity';
import { User } from './user.entity';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  isAuction!: boolean;

  @Column({ type: 'float' })
  basePrice!: number;

  @Column()
  maxParticipants!: number;

  @Column()
  duration!: number;

  @Column({ nullable: true })
  nextIn?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  openedAt?: Date;

  @Column({ nullable: true })
  phasedAt?: Date;

  @Column({ nullable: true })
  closedAt?: Date;

  @Column()
  scheduledAt!: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.createdMeetings)
  creatorUser!: User;

  @Column()
  creatorUserId!: string;

  @ManyToMany(() => Category, (category) => category.meetings)
  @JoinTable({
    name: 'meetings_have_categories',
    joinColumn: {
      name: 'meeting_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
    },
  })
  categories!: Category[];

  @ManyToMany(() => User, (user) => user.followedMeetings)
  followerUsers!: User[];

  @ManyToMany(() => User, (user) => user.attendedMeetings)
  attendeeUsers!: User[];

  @OneToMany(() => Collaboration, (collaboration) => collaboration.meeting)
  collaborations!: Collaboration[];

  @OneToMany(() => Purchase, (purchase) => purchase.meeting)
  purchases!: Purchase[];

  @OneToMany(() => Bid, (bids) => bids.meeting)
  bids!: Bid[];
}
