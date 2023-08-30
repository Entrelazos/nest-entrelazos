import { City } from 'src/common/entities/city.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class CompanyAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomenclature: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;
}
