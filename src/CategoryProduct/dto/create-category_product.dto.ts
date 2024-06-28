import { IsNumber } from 'class-validator';
import { CategoryProduct } from '../entities/category_product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryProductDto extends CategoryProduct {
  @ApiProperty({ example: 1, description: 'The product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 1, description: 'The category ID' })
  @IsNumber()
  categoryId: number;
}
