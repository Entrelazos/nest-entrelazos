import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'varchar', length: 50 })
  entity_type: string;
}
