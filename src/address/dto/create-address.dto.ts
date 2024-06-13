import {
  IsNumber,
  IsString,
  isNumber,
} from 'class-validator';

import { Address } from '../entities/address.entity';

export class CreateAddressDto extends Address {
  @IsString()
  state: string;
  @IsString()
  city: string;
  @IsString()
  street: string;
  @IsString()
  number: string;
  @IsString()
  postal_code: string;
  @IsString()
  description: string;
  @IsNumber()
  clientId: number;
}
