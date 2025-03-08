import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { In, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CompanyAddress } from './entities/company-address.entity';
import { CreateCompanyDto } from './dto/company.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CreateCompanyAddressDto } from './dto/company-address.dto';
import { UserCompany } from 'src/user/entities/user-company.entity';
import { Social } from 'src/common/entities/social.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyAddress)
    private readonly companyAddressRepository: Repository<CompanyAddress>,
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
    @InjectRepository(Social)
    private readonly socialRepository: Repository<Social>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    orderBy: string;
    orderDirection: 'ASC' | 'DESC';
    search: string;
    categoryIds: number[];
  }): Promise<Pagination<Company>> {
    const { page, limit, orderBy, orderDirection, search, categoryIds } =
      options;

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.addresses', 'addresses')
      .leftJoinAndSelect('addresses.city', 'city')
      .leftJoinAndSelect('city.region', 'region')
      .leftJoinAndSelect('region.country', 'country')
      .leftJoinAndMapMany(
        'company.images',
        'image',
        'images',
        'images.entity_id = company.id AND images.entity_type = :entityType',
        { entityType: 'company' },
      );

    if (categoryIds.length) {
      queryBuilder
        .leftJoinAndSelect('company.categories', 'categories')
        .andWhere('categories.id IN (:...categoryIds)', { categoryIds });
    }

    // Apply search filter
    if (search) {
      queryBuilder.andWhere('company.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Apply ordering
    queryBuilder.orderBy(`company.${orderBy}`, orderDirection);

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
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.addresses', 'addresses')
      .leftJoinAndSelect('addresses.city', 'city')
      .leftJoinAndSelect('city.region', 'region')
      .leftJoinAndSelect('region.country', 'country')
      .leftJoinAndSelect('company.products', 'products')
      .leftJoinAndSelect('company.users', 'users')
      .leftJoinAndSelect('users.user', 'user')
      .leftJoinAndSelect('company.social', 'social')
      .leftJoinAndMapMany(
        'company.images',
        'image',
        'images',
        'images.entity_id = company.id AND images.entity_type = :entityType',
        { entityType: 'company' },
      )
      .where({ name: name });

    return queryBuilder.getOne();
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name, nit, description, userIds, addresses, social, categoryIds } =
      createCompanyDto;
    let savedSocial: Social | undefined;
    if (social) {
      const socialNetworks = this.socialRepository.create(social);
      savedSocial = await this.socialRepository.save(socialNetworks);
    }

    const categories = await this.categoriesRepository.findBy({
      id: In(categoryIds),
    });
    if (categories.length !== categoryIds.length) {
      throw new Error('Some categories not found');
    }

    // Create company entity
    const company = this.companyRepository.create({
      name,
      nit,
      description,
      social: savedSocial,
      categories,
    });

    // Save company first to ensure its id is generated
    const savedCompany = await this.companyRepository.save(company);

    // Create company address entities
    if (addresses.length) {
      const companyAddresses = addresses.map((addressData) =>
        this.companyAddressRepository.create({
          ...addressData,
          company: savedCompany,
        }),
      );

      // Save company addresses
      await this.companyAddressRepository.save(companyAddresses);
    }

    const users = await this.usersRepository.findBy({
      id: In(userIds),
    });
    if (users.length !== userIds.length) {
      throw new Error('Some users not found');
    }
    const companyUsers = users.map((user) =>
      this.userCompanyRepository.create({ company: savedCompany, user }),
    );
    await this.userCompanyRepository.save(companyUsers);

    // Return created company
    return savedCompany;
  }

  async createCompanyAddress(
    createCompanyAddressDto: CreateCompanyAddressDto,
  ): Promise<CompanyAddress> {
    const companyAddress = this.companyAddressRepository.create(
      createCompanyAddressDto,
    );
    return await this.companyAddressRepository.save(companyAddress);
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
