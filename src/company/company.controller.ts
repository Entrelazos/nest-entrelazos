// src/companies/company.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/company.dto';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

@UseGuards(AuthGuard('jwt'))
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'name',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search = '',
  ): Promise<Pagination<Company>> {
    try {
      const options = { page, limit, orderBy, orderDirection, search };
      return await this.companyService.findAll(options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    try {
      return await this.companyService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      return await this.companyService.create(createCompanyDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    try {
      return await this.companyService.update(id, updateCompanyDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return await this.companyService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
