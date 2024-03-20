import { IsNotEmpty } from 'class-validator';
import { City } from 'src/common/entities/city.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly nit: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly nomenclature: string;

  @IsNotEmpty()
  readonly city: City;
}
