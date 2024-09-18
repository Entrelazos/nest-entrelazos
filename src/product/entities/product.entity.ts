import {
  Column,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
