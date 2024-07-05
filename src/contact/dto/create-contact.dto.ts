import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Name of the contact', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Address of the contact', example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Phone number of the contact', example: '123-456-7890' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email of the contact', example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Description of the contact', example: 'Main office location' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Google Maps link for the contact', example: 'https://maps.google.com/' })
  @IsNotEmpty()
  @IsString()
  googlemaps: string;
}
