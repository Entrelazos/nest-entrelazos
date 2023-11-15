import { IsNotEmpty } from 'class-validator';
export class TokenDTO {
  @IsNotEmpty()
  refreshToken: string;
}
