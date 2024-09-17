import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateCompanyAddressDto } from './company-address.dto';
import { CreateUserCompanyDto } from 'src/user/dto/create-user-company.dto';
import { CreateSocialDto } from 'src/common/dto/social.dto';
import { Category } from 'src/category/entities/category.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly nit: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly addresses: CreateCompanyAddressDto[];

  @IsOptional()
  @IsInt({ each: true })
  readonly userIds: number[];

  @IsOptional()
  readonly social: CreateSocialDto;

  @IsOptional()
  @IsInt({ each: true })
  readonly categoryIds: number[];
}
