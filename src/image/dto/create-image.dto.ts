import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ENTITY_TYPES,
  EntityType,
  IMAGE_TYPES,
  ImageType,
} from '../image.types';

export class CreateImageDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  entityId: number;

  @IsEnum(ENTITY_TYPES, {
    message:
      'entityType must be one of the following values: product, user, company',
  })
  entityType: EntityType;

  @IsEnum(IMAGE_TYPES, {
    message:
      'imageType must be one of the following values: user_profile, company_profile, company_banner, product_image',
  })
  imageType: ImageType;
}
