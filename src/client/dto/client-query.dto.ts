import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ClientQueryDto {
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
  userId?: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  birth_date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rg?: string;

}
