import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  @Column()
  is_service: boolean;

  @Column()
  is_public: boolean;

  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
  })
  price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => Company, (company) => company.product, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
