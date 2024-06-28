import { IsString, IsNumber } from 'class-validator'
import { Product } from '../entities/product.entity';
import { Transform } from 'class-transformer';

export class CreateProductDto extends Product{
    @IsString()
    name: string;
    
    @IsString()
    description: string;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    quantity: number;

    @IsString()
    bar_code: string;

    image: any;
}
