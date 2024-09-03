import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
