/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { City } from 'src/common/entities/city.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cellphone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  identification: string;

  @Column()
  is_active: boolean;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
