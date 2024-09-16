import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { EntityType } from './image.types';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file existence
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Call the service to handle image creation and saving
    const image = await this.imageService.createImage(createImageDto, file);

    // Return the saved image object
    return image;
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 }, // Adjust `maxCount` as needed
    ]),
  )
  async uploadMultipleImages(
    @Body() createImageDtos: CreateImageDto[],
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ) {
    // Validate file existence
    if (!files || !files.files || files.files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Ensure that the number of DTOs matches the number of files
    if (createImageDtos.length !== files.files.length) {
      throw new BadRequestException(
        'Number of DTOs must match number of files',
      );
    }

    // Process and save all images
    const imagePromises = createImageDtos.map((dto, index) =>
      this.imageService.createImage(dto, files.files[index]),
    );

    const images = await Promise.all(imagePromises);

    // Return the saved image objects
    return images;
  }

  @Get('upload')
  async getImages(
    @Query('entityId') entityId: number,
    @Query('entityType') entityType: EntityType,
  ): Promise<Image[]> {
    return this.imageService.findImagesByEntity(entityId, entityType);
  }
}
