import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async createImage(@Body() image: Partial<Image>): Promise<Image> {
    return this.imageService.createImage(image);
  }

  @Get(':entityType/:entityId')
  async getImages(
    @Param('entityId') entityId: number,
    @Param('entityType') entityType: string,
  ): Promise<Image[]> {
    return this.imageService.findImagesByEntity(entityId, entityType);
  }
}
