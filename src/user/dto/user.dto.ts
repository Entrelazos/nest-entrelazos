import { IsNotEmpty, IsBoolean } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    address: string;
    
    @IsNotEmpty()
    cellphone: string;
    
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    identification: string;
    
    @IsNotEmpty()
    @IsBoolean()
    is_active: boolean;
    
    @IsNotEmpty()
    name: string;
}