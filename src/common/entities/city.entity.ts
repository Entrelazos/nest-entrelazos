import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from './region.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  region_id: number;

  @OneToMany(() => User, (user) => user.city)
  users?: User[];

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'region_id' })
  region: Region;
}
