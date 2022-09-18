import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Collaboration } from './collaboration.entity';
import { Meeting } from './meeting.entity';
import { Notification } from './notification.entity';
import { Purchase } from './purchase.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  dateOfBirth!: Date;

  @Column({ type: 'character' })
  gender!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  about?: string;

  @Column({ nullable: true })
  profession?: string;

  @Column({ type: 'float', default: 0 })
  gains!: number;

  @Column({ default: false })
  isPublic!: boolean;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: true })
  acceptsEmails!: boolean;

  @Column({ default: 'en' })
  language!: string;

  @Column({ nullable: true, type: 'character varying' })
  refreshToken?: string | null;

  @Column({ nullable: true })
  bannedUntil?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable({
    name: 'users_have_categories',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
    },
  })
  categories!: Category[];

  @ManyToMany(() => User, (user) => user.followedUsers)
  followerUsers!: User[];

  @ManyToMany(() => User, (user) => user.followerUsers)
  @JoinTable({
    name: 'users_follow_users',
    joinColumn: {
      name: 'follower_id',
    },
    inverseJoinColumn: {
      name: 'followed_id',
    },
  })
  followedUsers!: User[];

  @OneToMany(() => Meeting, (meeting) => meeting.creatorUser)
  createdMeetings!: Meeting[];

  @ManyToMany(() => Meeting, (meeting) => meeting.followerUsers)
  @JoinTable({
    name: 'users_follow_meetings',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'meeting_id',
    },
  })
  followedMeetings!: Meeting[];

  @ManyToMany(() => Meeting, (meeting) => meeting.attendeeUsers)
  @JoinTable({
    name: 'users_attend_meetings',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'meeting_id',
    },
  })
  attendedMeetings!: Meeting[];

  @OneToMany(() => Collaboration, (collaboration) => collaboration.user)
  collaborations!: Collaboration[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases!: Purchase[];
}
