import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { UserCompany } from '../entities/user-company.entity';
import { CreateUserCompanyDto } from '../dto/create-user-company.dto';
import { CompanyService } from 'src/company/company.service';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(UserCompany)
    private userCompanyRepository: Repository<UserCompany>,
    private readonly companyService: CompanyService,
  ) {}

  async getUserCompanies(
    userId: number,
    options: {
      page: number;
      limit: number;
      orderBy: string;
      orderDirection: 'ASC' | 'DESC';
      search: string;
    },
  ): Promise<Pagination<Company>> {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create a query builder for Company entities
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.addresses', 'addresses')
      .leftJoinAndSelect('addresses.city', 'city')
      .leftJoinAndSelect('city.region', 'region')
      .leftJoinAndSelect('region.country', 'country')
      .innerJoinAndSelect('company.categories', 'categories')
      .innerJoin(
        'user_company',
        'userCompany',
        'userCompany.companyId = company.id',
      )
      .where('userCompany.userId = :userId', { userId });

    // Paginate the results
    return await paginate<Company>(queryBuilder, options);
  }

  async createUserCompany(
    createUserCompanyDto: CreateUserCompanyDto,
  ): Promise<UserCompany> {
    const { userId, companyId } = createUserCompanyDto;
    const userCompany = this.userCompanyRepository.create(createUserCompanyDto);
    const company = await this.companyService.findOne(companyId);
    if (!company) {
      throw new Error('Not existing company.');
    }
    userCompany.company = company;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Not existing user.');
    }
    userCompany.user = user;
    return this.userCompanyRepository.save(userCompany);
  }

  async updateUserCompany(
    id: number,
    updateUserCompanyDto: CreateUserCompanyDto,
  ): Promise<UserCompany> {
    await this.findOne(id); // Ensure the user company exists
    await this.userCompanyRepository.update(id, updateUserCompanyDto);
    return this.findOne(id);
  }

  async deleteUserCompany(id: number): Promise<void> {
    const userCompany = await this.findOne(id); // Ensure the user company exists
    await this.userCompanyRepository.remove(userCompany);
  }

  private async findOne(id: number): Promise<UserCompany> {
    const userCompany = await this.userCompanyRepository.findOne({
      where: { id },
    });

    if (!userCompany) {
      throw new NotFoundException(`UserCompany with ID ${id} not found`);
    }

    return userCompany;
  }
}
