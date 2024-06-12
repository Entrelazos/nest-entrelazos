import { IsNotEmpty } from 'class-validator';
import { City } from 'src/common/entities/city.entity';
import { Company } from '../entities/company.entity';
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
