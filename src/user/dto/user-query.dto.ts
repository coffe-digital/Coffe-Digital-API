import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

}
