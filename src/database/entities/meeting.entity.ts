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
import { Category } from './category.entity';
import { Collaboration } from './collaboration.entity';
import { Description } from './description.entity';
import { Image } from './image.entity';
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

  @Column()
  publishedAt!: Date;

  @Column()
  openedAt!: Date;

  @Column()
  phaseAt!: Date;

  @Column()
  closedAt!: Date;

  @Column()
  scheduledAt!: Date;

  @Column({ nullable: true })
  cancelledAt!: Date;

  @ManyToOne(() => Image, (image) => image.meetings)
  image!: Image;

  @Column()
  imageId!: string;

  @ManyToOne(() => Description, (description) => description.meetings)
  description!: Description;

  @Column()
  descriptionId!: string;

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
}
