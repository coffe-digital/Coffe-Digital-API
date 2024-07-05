import { IsBoolean, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ description: 'Name of the plan' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the plan' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Status of the plan (active/inactive)' })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ description: 'Price of the plan' })
  @IsNumber()
  price: number;
}
