import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlanQueryDto {
  @ApiProperty({ required: false, description: 'Name of the plan' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false, description: 'Description of the plan' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ required: false, description: 'Minimum price of the plan' })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false, description: 'Maximum price of the plan' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
