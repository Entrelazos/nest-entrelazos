import { IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @IsNotEmpty()
  role_name: string;
}
