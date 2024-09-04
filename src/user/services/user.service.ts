import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';

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
import { Social } from 'src/common/entities/social.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(City) private citiesRepository: Repository<City>,
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    user.roles.push(role);
    await this.usersRepository.save(user);
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
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
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
    const { email, cityId, socialId, roleIds, ...rest } = createUserDto;

    const social = socialId
      ? await this.socialRepository.findOneBy({ id: socialId })
      : null;

    const roles = await this.rolesRepository.findBy({ id: In(roleIds) });
    if (roles.length !== roleIds.length) {
      throw new Error('Some roles not found');
    }

    const city = await this.citiesRepository.findOneBy({ id: cityId });
    if (!city) {
      throw new Error('Not existing city.');
    }
    const user = this.usersRepository.create({
      email,
      city,
      social,
      roles,
      password: hashedPassword,
      ...rest,
    });

    return await this.usersRepository.save(user);
  }

  async getUsers(
    limit = 10,
    orderBy = 'name',
    orderDirection = 'name',
    page = 1,
    search = '',
  ): Promise<Pagination<User>> {
    const options: IPaginationOptions = { page, limit };

    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    queryBuilder.select([
      'users.cellphone',
      'users.email',
      'users.identification',
      'users.name',
    ]);
    queryBuilder.leftJoinAndSelect('users.roles', 'roles');
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
    const user = await this.usersRepository.findOneByOrFail({ id });
    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: [
        'companies',
        'companies.company',
        'companies.company.addresses',
        'roles',
        'city',
      ],
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { refreshToken },
    });

    return user;
  }

  async getUserCompanies(userId: number): Promise<Company[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['companies', 'companies.company'],
    });

    if (!user) {
      throw new NotFoundException(`User company with ID ${userId} not found`);
    }

    return user.companies.map((userCompany) => userCompany.company);
  }
}
