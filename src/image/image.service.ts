import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async createImage(image: Partial<Image>): Promise<Image> {
    const newImage = this.imageRepository.create(image);
    return await this.imageRepository.save(newImage);
  }

  async findImagesByEntity(
    entityId: number,
    entityType: string,
  ): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { entity_id: entityId, entity_type: entityType },
    });
  }
}
