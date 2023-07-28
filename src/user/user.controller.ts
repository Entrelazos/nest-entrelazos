import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateRoleDTO } from './dto/role.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('role')
  async createRole(@Body() createRoleDto: CreateRoleDTO) {
    try {
      return await this.userService.createRole(createRoleDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
