import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  cellphone: string;

  @IsNotEmpty()
  city_id: number;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  identification: string;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}
