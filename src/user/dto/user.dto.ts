import {
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly cellphone: string;

  @IsOptional()
  readonly city_id: number;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly identification: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_active: boolean;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly role_id: number;
}

export class UpdateUserDTO {
  @IsOptional()
  readonly cellphone?: string;

  @IsOptional()
  readonly city_id?: number;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly identification?: string;

  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;

  @IsOptional()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  readonly role_id?: number;
}
