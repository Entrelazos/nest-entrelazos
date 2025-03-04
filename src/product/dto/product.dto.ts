import {
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsString,
  IsOptional,
} from 'class-validator';

// Individual Product DTO
export class ProductDto {
  @IsNotEmpty()
  @IsString()
  readonly product_name: string;

  @IsNotEmpty()
  @IsString()
  readonly productDescription: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_service: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_public: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_approved: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  readonly price: number;

  @IsNotEmpty()
  @IsInt()
  readonly company_id: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  readonly category_ids: number[];

  readonly files?: Express.Multer.File[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true }) // ✅ Ensure all values are integers
  readonly existingImages?: number[];
}

// Wrapper DTO for bulk creation
export class CreateProductsDto {
  @IsNotEmpty()
  @IsArray()
  readonly products: ProductDto[];
}
