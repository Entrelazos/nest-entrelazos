import { City } from 'src/common/entities/city.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class CompanyAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomenclature: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
