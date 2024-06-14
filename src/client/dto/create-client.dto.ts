import { IsNotEmpty, IsString } from 'class-validator';

import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateClientDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  birth_date: string;
  @IsNotEmpty()
  @IsString()
  rg: string;
  /*@IsNotEmpty()
    @IsNumber()
    userId: number;*/
}
