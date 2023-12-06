import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { City } from 'src/common/entities/city.entity';
import { CreateRoleDTO } from '../dto/role.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { AssignUserRoleDTO } from '../dto/user.role.dto';
import * as bcrypt from 'bcrypt';
import { UniquenessValidationUtil } from '../../util/uniqueness-validation.util';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async associateUserWithRole(assignUserRoleDTO: AssignUserRoleDTO) {
    const user = await this.userRepository.findOneBy({
      id: assignUserRoleDTO.user_id,
    });
    const role = await this.roleRepository.findOneBy({
      id: assignUserRoleDTO.role_id,
    });

    if (!user || !role) {
      throw new Error('Not existing user or role.');
    }

    user.role = role;
    return this.userRepository.save(user);
  }

  async createRole(createRoleDto: CreateRoleDTO) {
    const validate = await this.uniquenessValidationUtil.validateUniqueness(
      'Role',
      'role_name',
      createRoleDto.role_name,
    );

    if (validate) {
      throw new Error(`Role ${createRoleDto.role_name} exists`);
    }
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async createUser(createUserDto: CreateUserDTO) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const validate = await this.uniquenessValidationUtil.validateUniqueness(
      'User',
      'email',
      createUserDto.email,
    );

    if (validate) {
      throw new Error(`The email ${createUserDto.email} is already in use`);
    }
    const { city_id, role_id } = createUserDto;
    const role = await this.roleRepository.findOneBy({
      id: role_id,
    });
    if (!role) {
      throw new Error('Not existing role.');
    }
    const city = await this.cityRepository.findOneBy({ id: city_id });
    if (!city) {
      throw new Error('Not existing city.');
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async getUsers(
    limit = 10,
    orderBy = 'name',
    orderDirection = 'name',
    page = 1,
    search = '',
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = { page, limit };

    const queryBuilder = this.userRepository.createQueryBuilder('users');
    queryBuilder.select([
      'users.cellphone',
      'users.email',
      'users.identification',
      'users.name',
    ]);
    queryBuilder.leftJoinAndSelect('users.role', 'role');
    queryBuilder.leftJoinAndSelect('users.city', 'city');

    if (search != '') {
      queryBuilder.andWhere(
        `(users.email LIKE '%${search}%' OR users.name LIKE '%${search}%' OR role_name LIKE '%${search}%')`,
      );
    }

    queryBuilder.orderBy(
      `users.${orderBy ?? 'id'}`,
      orderDirection == 'DESC' ? 'DESC' : 'ASC',
    );
    return paginate<User>(queryBuilder, options);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['companies', 'companies.company', 'role', 'city'],
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });

    return user;
  }

  async getUserCompanies(userId: number): Promise<Company[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['companies', 'companies.company'],
    });

    if (!user) {
      throw new NotFoundException(`User company with ID ${userId} not found`);
    }

    return user.companies.map((userCompany) => userCompany.company);
  }
}
