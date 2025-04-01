import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateImageDto } from './dto/create-image.dto';
import {
  EntityType,
  EntityTypeEnum,
  ImageType,
  ImageTypeEnum,
} from './image.types';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly uploadsDir =
    process.env.NODE_ENV === 'development' ? 'uploads' : '/var/www/uploads/';
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

  async createImage(
    createImageDto: CreateImageDto,
    file: Express.Multer.File,
  ): Promise<Image> {
    const { url, altText, description, entityId, entityType, imageType } =
      createImageDto;

    // Validate entity type
    const validEntityTypes = ['product', 'user', 'company'];
    if (!validEntityTypes.includes(entityType)) {
      throw new BadRequestException('Invalid entity type');
    }

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileExtension = path.extname(file.originalname);
    const sanitizedFileName = file.originalname.replace(/\s+/g, '-');
    const baseName = path.basename(sanitizedFileName, fileExtension);

    // Get entity data and build folder path
    const entity = await this.getEntity(entityType, entityId);
    if (!entity) {
      throw new NotFoundException(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } with ID ${entityId} not found`,
      );
    }

    const entityName = this.getEntityName(entity, entityType);
    const folderPath = path.join(
      process.env.NODE_ENV === 'development' ? process.cwd() : '',
      this.uploadsDir,
      `${entityType}-images`,
      entityName,
      entityId.toString(),
    );
    const imageName = `${baseName}-${currentDate}${fileExtension}`;

    // Ensure the directory exists
    fs.mkdirSync(folderPath, { recursive: true });

    // Build the new image URL
    const newImageUrl = path.join(
      `${entityType}-images`,
      entityName,
      entityId.toString(),
      imageName,
    );

    // Check if the image already exists for the entity
    const foundImage = await this.findOneImageByEntity(
      entityId,
      entityType,
      imageType,
    );

    if (foundImage) {
      const oldImagePath = path.join(
        process.env.NODE_ENV === 'development' ? process.cwd() : '',
        this.uploadsDir,
        foundImage.url,
      );

      // ✅ Delete previous image file from disk
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log(`Deleted old image: ${oldImagePath}`);
      }

      // ✅ Update existing image record
      foundImage.url = newImageUrl;
      foundImage.alt_text = altText;
      foundImage.description = description;
      foundImage.updated_at = new Date();
      fs.writeFileSync(path.join(folderPath, imageName), file.buffer); // Save new file
      return this.imageRepository.save(foundImage);
    } else {
      // ✅ Save new file to disk
      const fullPath = path.join(folderPath, imageName);
      fs.writeFileSync(fullPath, file.buffer);

      // ✅ Create a new image record
      const newImage = this.imageRepository.create({
        url: newImageUrl,
        alt_text: altText,
        description,
        entity_id: entityId,
        entity_type: entityType,
        image_type: imageType,
      });

      return this.imageRepository.save(newImage);
    }
  }

  private async getEntity(entityType: string, entityId: number): Promise<any> {
    switch (entityType) {
      case 'product':
        return this.productRepository.findOne({
          where: { id: entityId },
          relations: ['company'],
        });
      case 'user':
        return this.userRepository.findOne({ where: { id: entityId } });
      case 'company':
        return this.companyRepository.findOne({ where: { id: entityId } });
      default:
        throw new BadRequestException('Invalid entity type');
    }
  }

  private getEntityName(entity: any, entityType: string): string {
    switch (entityType) {
      case 'product':
        return entity.company.name.replace(/\s+/g, '_');
      case 'user':
        return entity.name.replace(/\s+/g, '_');
      case 'company':
        return entity.name.replace(/\s+/g, '_');
      default:
        throw new BadRequestException('Invalid entity type');
    }
  }

  async createImages(
    createImageDtos: CreateImageDto[],
    files: Express.Multer.File[],
  ): Promise<Image[]> {
    if (createImageDtos.length !== files.length) {
      throw new Error('Number of DTOs must match number of files');
    }

    const imagePromises = createImageDtos.map((dto, index) =>
      this.createImage(dto, files[index]),
    );

    return Promise.all(imagePromises);
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

  async findOneImageByEntity(
    entityId: number,
    entityType: EntityType,
    imageType: ImageType,
    imageUrl?: string,
  ): Promise<Image> {
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
      .andWhere('image.entity_type = :entityType', { entityType })
      .andWhere('image.image_type = :imageType', { imageType });

    if (
      imageUrl &&
      imageType !== ImageTypeEnum.CompanyBanner &&
      imageType !== ImageTypeEnum.CompanyProfile
    ) {
      query.andWhere('image.url = :imageUrl', { imageUrl });
    }

    return query.getOne();
  }

  /**
   * Delete images that are no longer associated with the product
   */
  async deleteRemovedImages(productId: number, existingImageIds: number[]) {
    // Get all images currently associated with the product
    const allProductImages = await this.findImagesByEntity(
      productId,
      EntityTypeEnum.Product,
    );

    // Find images that should be deleted
    const imagesToDelete = allProductImages.filter(
      (img) => !existingImageIds.includes(img.id),
    );

    for (const image of imagesToDelete) {
      const imagePath = path.join(
        process.env.NODE_ENV === 'development' ? process.cwd() : '',
        this.uploadsDir,
        image.url,
      );

      // Delete file from the file system
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Delete image record from database
      await this.imageRepository.delete(image.id);
    }
  }
}
