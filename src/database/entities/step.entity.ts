import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from './bid.entity';

@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float' })
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Bid, (bid) => bid.steps)
  bid!: Bid;

  @Column()
  bidId!: string;
}
