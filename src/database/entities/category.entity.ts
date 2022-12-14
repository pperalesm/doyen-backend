import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => User, (user) => user.categories)
  users!: User[];

  @ManyToMany(() => Meeting, (meeting) => meeting.categories)
  meetings!: Meeting[];
}
