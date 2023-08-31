import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignUserRoleDTO {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;
}
