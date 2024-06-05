import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyAddress } from './company-address.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserCompany } from 'src/user/entities/user-company.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: string;

  @Column({ unique: true })
  nit: string;

  @OneToMany(() => CompanyAddress, (CompanyAddress) => CompanyAddress.company)
  address?: CompanyAddress[];

  @OneToMany(() => Product, (product) => product.company)
  products?: Product[];

  @Column()
  description: string;

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  users: UserCompany[];
}
