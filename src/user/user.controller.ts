import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserService } from './services/user.service';
import { CreateRoleDTO } from './dto/role.dto';
import { AuthGuard } from '@nestjs/passport';
import { Company } from 'src/company/entities/company.entity';
import { UserCompanyService } from './services/user-company.service';
import { UserCompany } from './entities/user-company.entity';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { Roles } from 'src/guards/roles/roles.decorator';
import { Role } from 'src/types/role.types';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Query('email') email: string) {
    try {
      return await this.userService.findByEmail(email);
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

  /* User Roles endpoints */
  @Post('role')
  async createRole(@Body() createRoleDto: CreateRoleDTO) {
    try {
      return await this.userService.createRole(createRoleDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/role/:roleId')
  @Roles(Role.Admin)
  async assignRoleToUser(
    @Param('id') userId: number,
    @Param('roleId') roleId: number,
  ) {
    await this.userService.assignRoleToUser(userId, roleId);
    return { message: 'Role assigned successfully' };
  }

  /* User Companies endpoints */
  @Get(':id/companies')
  async getUserCompanies(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'name',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search = '',
  ): Promise<Pagination<Company>> {
    const options = {
      page,
      limit,
      orderBy,
      orderDirection,
      search,
    };
    return this.userCompanyService.getUserCompanies(userId, options);
  }

  @Post('/company')
  async createUserCompany(
    @Body() createUserCompanyDto: CreateUserCompanyDto,
  ): Promise<UserCompany> {
    try {
      return await this.userCompanyService.createUserCompany(
        createUserCompanyDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('/company/:id')
  async updateUserCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserCompanyDto: CreateUserCompanyDto,
  ): Promise<UserCompany> {
    return this.userCompanyService.updateUserCompany(id, updateUserCompanyDto);
  }

  @Delete('/company/:id')
  async deleteUserCompany(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.userCompanyService.deleteUserCompany(id);
  }
}
