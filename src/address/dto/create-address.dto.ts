import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'State of the address' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'City of the address' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Street name' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'House or apartment number' })
  @IsString()
  number: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: 'Additional description of the address' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID of the client associated with this address' })
  @IsNumber()
  clientId: number;
}
