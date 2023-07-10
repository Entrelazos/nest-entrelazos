/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

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
  createdAt: Date;
}
