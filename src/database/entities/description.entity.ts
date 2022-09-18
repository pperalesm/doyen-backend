import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity('descriptions')
export class Description {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  body!: string;

  @OneToMany(() => Meeting, (meeting) => meeting.description)
  meetings!: Meeting[];
}
