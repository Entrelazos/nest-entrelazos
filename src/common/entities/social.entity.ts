import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Social extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  whatsapp: string;

  @Column()
  facebook: string;

  @Column()
  instagram: string;

  @Column()
  linkedin: string;

  @Column()
  x: string;

  @OneToMany(() => Company, (company) => company.social)
  companies?: Company[];

  @OneToMany(() => User, (user) => user.social)
  users?: User[];
}
