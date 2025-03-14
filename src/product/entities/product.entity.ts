import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ProductAttributes } from './product-attributes.entity';
import { ApprovalStatus } from '../product.types';

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

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: ApprovalStatus;

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

  // ✅ Alternative: Linking to a separate table (if needed)
  @OneToOne(() => ProductAttributes, (attributes) => attributes.product, {
    cascade: true,
  })
  attributes: ProductAttributes;
}
export { ApprovalStatus };
