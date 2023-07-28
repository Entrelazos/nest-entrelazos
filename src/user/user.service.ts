import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    const validate = await this.validateUniqueness(
      'Role',
      'email',
      createUserDto.email,
    );

    if (validate) {
      throw new Error(`The email ${createUserDto.email} is already in use`);
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
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

  private async validateUniqueness(
    entityName: any,
    column: string,
    value: any,
  ): Promise<boolean> {
    const repository = this.entityManager.getRepository(entityName);
    const existingEntity = await repository.findOne({
      where: { [column]: value },
    });
    if (existingEntity) {
      return true;
    }
    return false;
  }
}
