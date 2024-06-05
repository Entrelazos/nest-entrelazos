/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { City } from 'src/common/entities/city.entity';
import { UserCompany } from './user-company.entity';
import { Social } from 'src/common/entities/social.entity';

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

  @Column()
  city_id: number;

  @Column()
  role_id: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => City, (city) => city.users, { nullable: false })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city: City;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user)
  companies: UserCompany[];

  @ManyToOne(() => Social, (social) => social.users)
  @JoinColumn({ name: 'social_id', referencedColumnName: 'id' })
  social: Social;
}
