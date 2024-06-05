import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CompanyAddress } from './entities/company-address.entity';
import { CreateCompanyDto } from './dto/company.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateCompanyAddressDto } from './dto/company-address.dto';
import { UserCompany } from 'src/user/entities/user-company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyAddress)
    private readonly companyAddressRepository: Repository<CompanyAddress>,
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
    // @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    orderBy: string;
    orderDirection: 'ASC' | 'DESC';
    search: string;
  }): Promise<Pagination<Company>> {
    const { page, limit, orderBy, orderDirection, search } = options;

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.addresses', 'addresses')
      .leftJoinAndSelect('addresses.city', 'city')
      .leftJoinAndSelect('city.region', 'region')
      .leftJoinAndSelect('region.country', 'country')
      .orderBy(`company.${orderBy}`, orderDirection);

    if (search) {
      queryBuilder.where(`company.name LIKE :search`, {
        search: `%${search}%`,
      });
      // Add other search conditions as needed
    }

    return await paginate<Company>(queryBuilder, { page, limit });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['addresses', 'products', 'users'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async findOneByName(name: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { name },
      relations: [
        'addresses',
        'addresses.city',
        'addresses.city.region',
        'addresses.city.region.country',
        'products',
        'users',
        'users.user',
        'social',
      ],
    });

    if (!company) {
      throw new NotFoundException(`Company with name ${name} not found`);
    }

    return company;
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name, type, nit, users, addresses } = createCompanyDto;

    // Create company entity
    const company = this.companyRepository.create({ name, type, nit });

    // Validate addresses existence
    if (!addresses || addresses.length === 0) {
      throw new BadRequestException('Company addresses are required.');
    }

    // Save company first to ensure its id is generated
    const savedCompany = await this.companyRepository.save(company);

    // Create company address entities
    const companyAddresses = addresses.map((addressData) =>
      this.companyAddressRepository.create({
        ...addressData,
        company: savedCompany,
      }),
    );

    // Save company addresses
    await this.companyAddressRepository.save(companyAddresses);

    if (users?.length) {
      // Create company address entities
      const companyUsers = users.map((usersData) =>
        this.userCompanyRepository.create({
          ...usersData,
          company: savedCompany,
        }),
      );
      await this.userCompanyRepository.save(companyUsers);
    }

    // Return created company
    return savedCompany;
  }

  async createCompanyAddress(
    createCompanyAddressDto: CreateCompanyAddressDto,
  ): Promise<CompanyAddress> {
    return await this.companyAddressRepository.save(createCompanyAddressDto);
  }

  async update(
    id: number,
    updateCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    await this.companyRepository.update(id, updateCompanyDto);
    return this.companyRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }
}
