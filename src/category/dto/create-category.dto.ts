import { IsString } from 'class-validator';
import { Category } from '../entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto extends Category {
  @ApiProperty({ example: 'Coffe', description: 'The name of the category' })
  @IsString()
  name: string;
}
