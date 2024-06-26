import { IsString, IsNumber } from 'class-validator';
import { Brand } from "../entities/brand.entity";

export class CreateBrandDto extends Brand{
    @IsString()
    name: string;
    
    @IsNumber()
    product_id: number;
}
