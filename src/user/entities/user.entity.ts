/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { City } from 'src/common/entities/city.entity';
import { UserCompany } from './user-company.entity';
import { Social } from 'src/common/entities/social.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
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

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => City, (city) => city.users, { nullable: false })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user)
  companies: UserCompany[];

  @ManyToOne(() => Social, (social) => social.users)
  @JoinColumn({ name: 'social_id', referencedColumnName: 'id' })
  social: Social;
}
