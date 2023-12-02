import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: string;

  @IsNotEmpty()
  readonly nit: string;

  @IsNotEmpty()
  readonly description: string;
}
