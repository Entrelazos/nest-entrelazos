import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyAddress } from './company-address.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserCompany } from 'src/user/entities/user-company.entity';
import { Social } from 'src/common/entities/social.entity';

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
  addresses?: CompanyAddress[];

  @OneToMany(() => Product, (product) => product.company)
  products?: Product[];

  @Column()
  description: string;

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  users: UserCompany[];

  @ManyToOne(() => Social, (socialNetworks) => socialNetworks.companies)
  @JoinColumn({ name: 'social_id', referencedColumnName: 'id' })
  social: Social;
}
