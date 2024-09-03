import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { EntityType } from './image.types';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async createImage(@Body() createImageDto: CreateImageDto): Promise<Image> {
    return this.imageService.createImage(createImageDto);
  }

  @Get(':entityType/:entityId')
  async getImages(
    @Param('entityId') entityId: number,
    @Param('entityType') entityType: EntityType,
  ): Promise<Image[]> {
    return this.imageService.findImagesByEntity(entityId, entityType);
  }
}
