import { IsNotEmpty } from 'class-validator';
import { CompanyAddress } from '../entities/company-address.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly nit: string;

  @IsNotEmpty()
  readonly addresses: CompanyAddress[];
}
