import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Company } from 'src/company/entities/company.entity';
import { Role } from 'src/types/role.types';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  @ManyToMany(() => Company, (company) => company.categories)
  @JoinTable({ name: 'company_category' })
  companies: Company[];

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable({ name: 'product_category' })
  products: Product[];
}
