import { IsNotEmpty } from 'class-validator';
import { City } from 'src/common/entities/city.entity';
import { Company } from '../entities/company.entity';

export class CreateCompanyAddressDto {
  @IsNotEmpty()
  readonly nomenclature: string;

  @IsNotEmpty()
  readonly city: City;

  @IsNotEmpty()
  readonly company?: Company;
}
