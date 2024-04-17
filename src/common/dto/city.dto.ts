import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCityDTO {
  @ApiProperty({ description: 'Nombre de la ciudad' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Código de la ciudad' })
  @IsString()
  readonly code: string;

  @ApiProperty({ description: 'Región a la que pertenece' })
  @IsNumber()
  readonly region_id: number;
}
