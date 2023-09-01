import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/role.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { AssignUserRoleDTO } from './dto/user.role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async associateUserWithRole(assignUserRoleDTO: AssignUserRoleDTO) {
    const user = await this.userRepository.findOneBy({
      id: assignUserRoleDTO.user_id,
    });
    const role = await this.roleRepository.findOneBy({
      id: assignUserRoleDTO.role_id,
    });

    if (!user || !role) {
      return null;
    }
    console.log(user, role);

    user.role = role;
    return this.userRepository.save(user);
  }

  async createRole(createRoleDto: CreateRoleDTO) {
    const validate = await this.validateUniqueness(
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
    const validate = await this.validateUniqueness(
      'User',
      'email',
      createUserDto.email,
    );

    if (validate) {
      throw new Error(`The email ${createUserDto.email} is already in use`);
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: createUserDto.identification,
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
    queryBuilder.leftJoinAndSelect('users.role', 'role');

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

  private async validateUniqueness(
    entityName: string,
    column: string,
    value: any,
  ): Promise<boolean> {
    const repository = this.entityManager.getRepository(entityName);
    const existingEntity = await repository.findOne({
      where: { [column]: value },
    });
    return !!existingEntity;
  }
}
