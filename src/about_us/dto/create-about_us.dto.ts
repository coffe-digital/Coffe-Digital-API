import { IsString } from 'class-validator';
import { AboutUs } from '../entities/about_us.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutUsDto extends AboutUs {
  @ApiProperty({ example: 'Our company is dedicated to...' })
  @IsString()
  description: string;
}
