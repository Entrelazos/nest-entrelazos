import { IsString } from 'class-validator';

export class CreateCountryDTO {
  @IsString()
  readonly name: string;
  @IsString()
  readonly code: string;
}
