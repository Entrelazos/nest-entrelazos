import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CompanyAddress } from './entities/company-address.entity';
import { CreateCompanyDto } from './dto/company.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateCompanyAddressDto } from './dto/company-address.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyAddress)
    private readonly companyAddressRpository: Repository<CompanyAddress>,
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
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('address.city', 'city')
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
      relations: ['address', 'products', 'users'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { nomenclature, city } = createCompanyDto;
    const companyEntity = this.companyRepository.create(createCompanyDto);
    console.log(companyEntity.id);

    const savedCompany = await this.companyRepository.save(createCompanyDto);
    await this.createCompanyAddress({
      nomenclature,
      city,
      company: savedCompany,
    });
    return savedCompany;
  }

  async createCompanyAddress(
    createCompanyAddressDto: CreateCompanyAddressDto,
  ): Promise<CompanyAddress> {
    return await this.companyAddressRpository.save(createCompanyAddressDto);
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
