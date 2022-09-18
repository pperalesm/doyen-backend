import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  url!: string;

  @OneToMany(() => Meeting, (meeting) => meeting.image)
  meetings!: Meeting[];
}
