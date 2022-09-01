import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  description?: string;

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

  @Column({ nullable: true })
  bannedUntil?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
