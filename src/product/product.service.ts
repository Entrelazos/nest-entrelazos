import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ApprovalStatus } from './product.types';
import { User } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly imageService: ImageService,
    // @InjectRepository(User) private userRepository: Repository<User>,
    // @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly uniquenessValidationUtil: UniquenessValidationUtil,
    private readonly eventEmitter: EventEmitter2,
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
        is_public,
        is_service,
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
        is_public: String(is_public) === 'true',
        is_service: String(is_service) === 'true',
        approval_status: ApprovalStatus.PENDING,
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
      existingImages, // IDs of images that should be kept
      files,
      ...productData
    } = updateProductDto;

    // Find the existing product
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'company'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Find and validate categories
    if (category_ids) {
      const categories = await this.categoryRepository.findBy({
        id: In(category_ids),
      });
      if (categories.length !== category_ids.length) {
        throw new BadRequestException('Some categories could not be found');
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

    // Handle image deletions
    await this.imageService.deleteRemovedImages(id, existingImages || []);

    // Handle new image uploads
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

  async updateApprovalStatus(
    productId: number,
    adminId: number,
    status: ApprovalStatus,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    // Ensure only admins can approve/reject products
    const adminUser = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['roles'],
    });

    if (
      !adminUser ||
      !adminUser.roles.some((role) => role.role_name === 'admin')
    ) {
      throw new ForbiddenException(
        'Only admins can change product approval status',
      );
    }

    product.approval_status = status;
    await this.productRepository.save(product);

    this.eventEmitter.emit('product.statusChanged', product);

    return product;
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
