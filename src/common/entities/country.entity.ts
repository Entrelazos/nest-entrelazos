import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from './region.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  alpha_code: string;

  @OneToMany(() => Region, (region) => region.country)
  region?: Region[];
}
