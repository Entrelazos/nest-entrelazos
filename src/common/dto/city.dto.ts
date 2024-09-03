import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCityDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  regionId: number; // Assuming region is referenced by ID
}
