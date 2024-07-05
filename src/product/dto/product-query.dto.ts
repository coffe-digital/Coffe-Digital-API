import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductQueryDto {
  @ApiProperty({ required: false, description: 'Name of the product' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false, description: 'Description of the product' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ required: false, description: 'Barcode of the product' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bar_code?: string;

  @ApiProperty({ required: false, description: 'Minimum price of the product' })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false, description: 'Maximum price of the product' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ required: false, description: 'Minimum quantity of the product' })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @ApiProperty({ required: false, description: 'Maximum quantity of the product' })
  @IsOptional()
  @IsNumber()
  maxQuantity?: number;
}
