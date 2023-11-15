import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyAddress } from './company.address.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  nit: string;

  @OneToMany(() => CompanyAddress, (CompanyAddress) => CompanyAddress.company)
  address?: CompanyAddress[];

  @OneToMany(() => Product, (product) => product.company)
  product?: Product[];

  @Column()
  description: string;
}
