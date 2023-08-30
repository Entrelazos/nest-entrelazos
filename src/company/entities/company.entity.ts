import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyAddress } from './company.address.entity';

export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  nit: string;

  @OneToMany(() => CompanyAddress, (CompanyAddress) => CompanyAddress.id)
  address?: CompanyAddress[];

  @Column()
  description: string;
}
