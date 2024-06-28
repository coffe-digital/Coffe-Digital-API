import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateClientDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
  birth_date: string;
  @IsNotEmpty()
  @IsString()
  rg: string;
  /*@IsNotEmpty()
    @IsNumber()
    userId: number;*/
}
