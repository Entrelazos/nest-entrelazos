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

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => City, (city) => city.region)
  cities?: City[];

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
