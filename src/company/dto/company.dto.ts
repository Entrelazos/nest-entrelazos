import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCompanyAddressDto } from './company-address.dto';
import { CreateUserCompanyDto } from 'src/user/dto/create-user-company.dto';
import { CreateSocialDto } from 'src/common/dto/social.dto';

export class CreateCompanyDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly nit: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly addresses: CreateCompanyAddressDto[];

  @IsOptional()
  readonly users: CreateUserCompanyDto[];

  @IsOptional()
  readonly social: CreateSocialDto;
}
