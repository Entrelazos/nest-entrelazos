import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { CreateRoleDTO } from './dto/role.dto';
import { AssignUserRoleDTO } from './dto/user.role.dto';
import { AuthGuard } from '@nestjs/passport';
import { Company } from 'src/company/entities/company.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('role/assign')
  async assignUserRole(@Body() assignUserRoleDTO: AssignUserRoleDTO) {
    try {
      return await this.userService.associateUserWithRole(assignUserRoleDTO);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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

  @Get('/list')
  @UseGuards(AuthGuard('jwt'))
  async getUsers(
    @Query('limit') limit: number,
    @Query('order') orderBy: string,
    @Query('dir') orderDirection: string,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    try {
      return await this.userService.getUsers(
        limit,
        orderBy,
        orderDirection,
        page,
        search,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/companies')
  async getUserCompanies(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Company[]> {
    return this.userService.getUserCompanies(userId);
  }
}
