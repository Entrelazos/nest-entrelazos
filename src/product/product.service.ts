import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { IPaginationMeta, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async createMany(createProductDtos: CreateProductDto[]): Promise<Product[]> {
    const savedProducts: Product[] = [];

    for (const createProductDto of createProductDtos) {
      const { category_ids, company_id, productDescription, ...productData } =
        createProductDto;

      // Find the categories for each product (assuming category_ids is an array)
      const categories = await this.categoryRepository.findBy({
        id: In(category_ids),
      });

      if (categories.length !== category_ids.length) {
        throw new Error('Some categories could not be found');
      }

      // Find company for each product
      const company = await this.companyRepository.findOneOrFail({
        where: { id: company_id },
      });

      // Create product entity
      const product = this.productRepository.create({
        ...productData,
        product_description: productDescription, // Rename field
        categories, // Now it's an array of categories
        company,
      });

      // Save product
      const savedProduct = await this.productRepository.save(product);
      savedProducts.push(savedProduct);
    }

    // Return array of saved products
    return savedProducts;
  }

  async update(
    id: number,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async getProductsByCompany(
    companyId: number,
    page = 1,
    limit = 10,
    orderBy = 'id', // Default orderBy column
    orderDirection: 'ASC' | 'DESC' = 'ASC', // Default order direction
  ): Promise<Pagination<Company>> {
    const options = { page, limit };
    const queryBuilder: SelectQueryBuilder<Company> =
      this.companyRepository.createQueryBuilder('company');
    queryBuilder
      .where('company.id = :companyId', { companyId })
      .leftJoinAndSelect('company.products', 'products')
      .orderBy(`company.${orderBy}`, orderDirection);

    return await paginate<Company>(queryBuilder, options);
  }

  async getCategoryWithProducts(
    categoryId: number,
    page = 1,
    limit = 10,
    orderBy = 'id', // Default orderBy column
    orderDirection: 'ASC' | 'DESC' = 'ASC', // Default order direction
  ): Promise<Pagination<Category>> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.categoryRepository.createQueryBuilder('category');

    queryBuilder
      .where('category.id = :id', { id: categoryId })
      .leftJoinAndSelect('category.products', 'products')
      .leftJoinAndSelect('products.company', 'company')
      .orderBy(`category.${orderBy}`, orderDirection);

    return await paginate<Category>(queryBuilder, {
      page,
      limit,
    });
  }
}
