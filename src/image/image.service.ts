import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { EntityType } from './image.types';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createImage(createImageDto: CreateImageDto): Promise<Image> {
    const { url, altText, description, entityId, entityType } = createImageDto;

    // Check entity existence based on entityType
    let entityExists = false;
    switch (entityType) {
      case 'product':
        entityExists = !!(await this.productRepository.findOne({
          where: { id: entityId },
        }));
        break;
      case 'user':
        entityExists = !!(await this.userRepository.findOne({
          where: { id: entityId },
        }));
        break;
      case 'company':
        entityExists = !!(await this.companyRepository.findOne({
          where: { id: entityId },
        }));
        break;
      default:
        throw new Error('Invalid entity type');
    }

    if (!entityExists) {
      throw new NotFoundException(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } with ID ${entityId} not found`,
      );
    }

    // Create and save the image if the entity exists
    const image = this.imageRepository.create({
      url,
      alt_text: altText,
      description,
      entity_id: entityId,
      entity_type: entityType,
    });

    return this.imageRepository.save(image);
  }

  async findImagesByEntity(
    entityId: number,
    entityType: EntityType,
  ): Promise<Image[]> {
    const query = this.imageRepository.createQueryBuilder('image');

    // Dynamically build the join based on entityType
    switch (entityType) {
      case 'product':
        query.innerJoinAndSelect(
          Product,
          'product',
          'image.entity_id = product.id',
        );
        break;
      case 'user':
        query.innerJoinAndSelect(User, 'user', 'image.entity_id = user.id');
        break;
      case 'company':
        query.innerJoinAndSelect(
          Company,
          'company',
          'image.entity_id = company.id',
        );
        break;
      default:
        throw new Error('Invalid entity type');
    }

    // Add filters to the query
    query
      .where('image.entity_id = :entityId', { entityId })
      .andWhere('image.entity_type = :entityType', { entityType });

    return query.getMany();
  }
}
