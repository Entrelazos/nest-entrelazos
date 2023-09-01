import { IsNumber, IsString } from 'class-validator';

export class CreateRegionDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly code: string;
  @IsNumber()
  readonly country_id: number;
}
