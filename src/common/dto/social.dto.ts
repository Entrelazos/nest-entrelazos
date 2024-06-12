import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  whatsapp: string;

  @IsNotEmpty()
  @IsString()
  facebook: string;

  @IsNotEmpty()
  @IsString()
  instagram: string;

  @IsNotEmpty()
  @IsString()
  linkedin: string;

  @IsNotEmpty()
  @IsString()
  x: string;
}
