import { IsNotEmpty } from 'class-validator';

// src/user/dto/create-user-company.dto.ts
export class CreateUserCompanyDto {
  @IsNotEmpty()
  readonly userId: number;
  @IsNotEmpty()
  readonly companyId: number;
  @IsNotEmpty()
  readonly jobPosition: string;
  // Add other properties as needed
}
