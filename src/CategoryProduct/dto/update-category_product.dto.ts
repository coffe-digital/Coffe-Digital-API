import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCategoryProductDto } from './create-category_product.dto';

export class UpdateCategoryProductDto extends PartialType(
  CreateCategoryProductDto,
) {
  @ApiPropertyOptional({ example: 1, description: 'The product ID' })
  productId?: number;

  @ApiPropertyOptional({ example: 1, description: 'The category ID' })
  categoryId?: number;
}
