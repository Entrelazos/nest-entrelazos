import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  EntityType,
  ENTITY_TYPES,
  IMAGE_TYPES,
  ImageType,
} from '../image.types';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  entity_id: number;

  @Column({
    type: 'enum',
    enum: ENTITY_TYPES,
  })
  entity_type: EntityType;

  @Column({
    type: 'enum',
    enum: IMAGE_TYPES,
  })
  image_type: ImageType;
}
