import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  price: number;

  @ApiProperty({ description: 'Quantity of the product' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @ApiProperty({ description: 'Barcode of the product' })
  @IsString()
  bar_code: string;

  @ApiProperty({ description: 'Optional: ID of the brand associated with the product' })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({ description: 'Image of the product', type: 'string', format: 'binary' })
  @IsString()
  @IsOptional()
  image: any;
}
