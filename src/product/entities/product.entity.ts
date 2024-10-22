import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  @Column()
  product_description: string;

  @Column()
  is_service: boolean;

  @Column()
  is_public: boolean;

  @Column()
  is_approved: boolean;

  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
  })
  price: number;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_category' })
  categories: Category[];
}
