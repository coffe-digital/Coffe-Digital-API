import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty({ description: 'State of the address' })
  state: string;

  @ApiProperty({ description: 'City of the address' })
  city: string;

  @ApiProperty({ description: 'Street name' })
  street: string;

  @ApiProperty({ description: 'House or apartment number' })
  number: string;

  @ApiProperty({ description: 'Postal code' })
  postal_code: string;

  @ApiProperty({ description: 'Additional description of the address' })
  description: string;

  @ApiProperty({ description: 'ID of the client associated with this address' })
  clientId: number;
}
