import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_attributes')
export class ProductAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'json', nullable: true }) // Use 'jsonb' for PostgreSQL
  attributes: Record<string, any>;
}
