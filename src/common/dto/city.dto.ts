import { IsString, IsNumber } from 'class-validator';

export class CreateCityDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly code: string;
  @IsNumber()
  readonly region_id: number;
}
