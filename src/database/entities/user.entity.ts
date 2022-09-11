import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

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

  @Column({ default: 0 })
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
}
