import { IsNotEmpty, IsBoolean, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly product_name: string;

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
  readonly category_id: number;

  @IsNotEmpty()
  @IsInt()
  readonly company_id: number;
}
