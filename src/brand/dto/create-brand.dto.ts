import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';

export class CreateBrandDto extends Brand {
  @ApiProperty({ example: 'Nike', description: 'Name of the brand' })
  @IsString()
  name: string;
}
