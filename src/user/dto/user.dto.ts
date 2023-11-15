import {
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
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
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one special character, and a minimum length of 8 characters.',
    },
  )
  readonly password: string;

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

export class LoginUserDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
