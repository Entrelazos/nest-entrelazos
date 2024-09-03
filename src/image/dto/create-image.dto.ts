import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ENTITY_TYPES, EntityType } from '../image.types';

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
}
