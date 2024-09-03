/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  route: string;

  @Column()
  method: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'permission_role' })
  roles: Role[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'user_role' })
  users: User[];
}
