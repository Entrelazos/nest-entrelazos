import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { CreateCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';
import { IPaginationMeta, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!category) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const product = this.categoryRepository.create(createCategoryDto);

    return await this.productRepository.save(product);
  }

  async update(
    id: number,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.categoryRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async getProductsByCompany(
    companyId: number,
    page = 1,
    limit = 10,
    orderBy = 'id', // Default orderBy column
    orderDirection: 'ASC' | 'DESC' = 'ASC', // Default order direction
  ): Promise<Pagination<Product>> {
    const options = { page, limit };
    const queryBuilder: SelectQueryBuilder<Product> =
      this.productRepository.createQueryBuilder('product');
    queryBuilder.where('product.company = :companyId', { companyId });

    // Apply ordering
    queryBuilder.orderBy(`product.${orderBy}`, orderDirection);

    return paginate<Product, IPaginationMeta>(queryBuilder, options);
  }
}
