/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity({ name: 'user_company' })
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobPosition: string;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @ManyToOne(() => User, (user) => user.companies)
  user: User;
}
