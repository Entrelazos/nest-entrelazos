import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { EntityType } from './image.types';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import * as fs from 'fs';
import * as path from 'path';

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

  async createImage(
    createImageDto: CreateImageDto,
    file: Express.Multer.File,
  ): Promise<Image> {
    const { url, altText, description, entityId, entityType } = createImageDto;

    let folderPath: string;
    let imageName: string;
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileExtension = path.extname(file.originalname);
    const sanitizedFileName = file.originalname.replace(/\s+/g, '-');
    const baseName = path.basename(sanitizedFileName, fileExtension);

    switch (entityType) {
      case 'product': {
        const product = await this.productRepository.findOne({
          where: { id: entityId },
          relations: ['company'],
        });
        if (!product)
          throw new NotFoundException(`Product with ID ${entityId} not found`);
        const companyName = product.company.name.replace(/\s+/g, '_');
        folderPath = path.join(
          __dirname,
          '..',
          '..',
          'images',
          'products-images',
          companyName,
          product.id.toString(),
        );
        imageName = `${baseName}-${currentDate}${fileExtension}`;
        break;
      }
      case 'user': {
        const user = await this.userRepository.findOne({
          where: {
            id: entityId,
          },
        });
        if (!user)
          throw new NotFoundException(`User with ID ${entityId} not found`);
        const userName = user.name.replace(/\s+/g, '_');
        folderPath = path.join(
          __dirname,
          '..',
          '..',
          'images',
          'user-images',
          userName,
          user.id.toString(),
        );
        imageName = `${baseName}-${currentDate}${fileExtension}`;
        break;
      }
      case 'company': {
        const company = await this.companyRepository.findOne({
          where: { id: entityId },
        });
        if (!company)
          throw new NotFoundException(`Company with ID ${entityId} not found`);
        const companyName = company.name.replace(/\s+/g, '_');
        folderPath = path.join(
          __dirname,
          '..',
          '..',
          'images',
          'companies-images',
          companyName,
          company.id.toString(),
        );
        imageName = `${baseName}-${currentDate}${fileExtension}`;
        break;
      }
      default:
        throw new Error('Invalid entity type');
    }

    // Ensure the directory exists
    fs.mkdirSync(folderPath, { recursive: true });

    // Save the file to the server
    const fullPath = path.join(folderPath, imageName);
    fs.writeFileSync(fullPath, file.buffer);

    // Save the image record in the database
    const image = this.imageRepository.create({
      url: fullPath, // Save the full path or relative path as needed
      alt_text: altText,
      description,
      entity_id: entityId,
      entity_type: entityType,
    });

    return this.imageRepository.save(image);
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
}
