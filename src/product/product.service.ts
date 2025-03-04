import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniquenessValidationUtil } from 'src/util/uniqueness-validation.util';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ImageService } from 'src/image/image.service';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { EntityTypeEnum, ImageTypeEnum } from 'src/image/image.types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly imageService: ImageService,
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
      relations: ['company', 'categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async createMany(createProductDtos: ProductDto[]): Promise<Product[]> {
    const savedProducts: Product[] = [];

    for (const createProductDto of createProductDtos) {
      const {
        category_ids,
        company_id,
        productDescription,
        files,
        ...productData
      } = createProductDto;

      // Find categories
      const categories = await this.categoryRepository.findBy({
        id: In(category_ids),
      });

      if (categories.length !== category_ids.length) {
        throw new Error('Some categories could not be found');
      }

      // Find company
      const company = await this.companyRepository.findOneOrFail({
        where: { id: company_id },
      });

      // Create product entity
      const product = this.productRepository.create({
        ...productData,
        product_description: productDescription, // Rename field
        categories, // Array of categories
        company,
      });

      // Save product
      const savedProduct = await this.productRepository.save(product);
      savedProducts.push(savedProduct);
      if (files.length) {
        files.map((file) => {
          const imageToUpload: CreateImageDto = {
            entityId: product.id,
            entityType: EntityTypeEnum.Product,
            imageType: ImageTypeEnum.ProductImage,
            altText: file.originalname,
            description: product.product_name,
          };
          this.imageService.createImage(imageToUpload, file);
        });
      }
    }

    return savedProducts;
  }

  async updateOne(id: number, updateProductDto: ProductDto): Promise<Product> {
    const {
      category_ids,
      company_id,
      productDescription,
      files,
      ...productData
    } = updateProductDto;

    // Find the existing product
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'company'],
    });

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Find and validate categories
    if (category_ids) {
      const categories = await this.categoryRepository.findBy({
        id: In(category_ids),
      });

      if (categories.length !== category_ids.length) {
        throw new Error('Some categories could not be found');
      }

      product.categories = categories;
    }

    // Find and validate company
    if (company_id) {
      const company = await this.companyRepository.findOneOrFail({
        where: { id: company_id },
      });
      product.company = company;
    }

    // Update product fields
    product.product_description =
      productDescription || product.product_description;
    Object.assign(product, productData);

    // Save updated product
    const updatedProduct = await this.productRepository.save(product);

    // Handle file updates (new images)
    if (files?.length) {
      for (const file of files) {
        const imageToUpload: CreateImageDto = {
          entityId: updatedProduct.id,
          entityType: EntityTypeEnum.Product,
          imageType: ImageTypeEnum.ProductImage,
          altText: file.originalname,
          description: updatedProduct.product_name,
        };
        await this.imageService.createImage(imageToUpload, file);
      }
    }

    return updatedProduct;
  }

  // async update(id: number, products: ProductDto[]): Promise<Product> {
  //   await this.productRepository.update(id, products);
  //   return this.productRepository.findOne({ where: { id } });
  // }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
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

    queryBuilder
      .where('product.company_id = :companyId', { companyId })
      .orderBy(`product.${orderBy}`, orderDirection);

    return await paginate<Product>(queryBuilder, options);
  }

  async getCategoryWithProducts(
    categoryId: number,
    page = 1,
    limit = 10,
    orderBy = 'id',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<Category>> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.categoryRepository.createQueryBuilder('category');

    queryBuilder
      .where('category.id = :id', { id: categoryId })
      .leftJoinAndSelect('category.products', 'products')
      .leftJoinAndSelect('products.company', 'company')
      .leftJoinAndMapMany(
        'products.images',
        'image',
        'images',
        'images.entity_id = products.id AND images.entity_type = :entityType',
        { entityType: 'product' },
      )
      .orderBy(`category.${orderBy}`, orderDirection);

    return await paginate<Category>(queryBuilder, {
      page,
      limit,
    });
  }
}
