import { IsNotEmpty } from 'class-validator';
import { CreateCityDTO } from 'src/common/dto/city.dto';
import { CreateCompanyDto } from './company.dto';

export class CreateCompanyAddressDto {
  @IsNotEmpty()
  readonly nomenclature: string;

  @IsNotEmpty()
  readonly city: CreateCityDTO;

  @IsNotEmpty()
  readonly company?: CreateCompanyDto;
}
