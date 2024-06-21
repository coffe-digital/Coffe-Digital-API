import { IsString, IsNumber } from 'class-validator'
import { Product } from '../entities/product.entity';

export class CreateProductDto extends Product{
    @IsString()
    name: string;
    
    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsString()
    bar_code: string;

    @IsString()
    image: string;
}
