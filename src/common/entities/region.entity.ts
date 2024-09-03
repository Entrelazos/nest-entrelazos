import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Country } from './country.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country_id: number;

  @OneToMany(() => City, (city) => city.region)
  cities?: City[];

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
