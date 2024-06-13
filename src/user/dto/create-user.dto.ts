import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'The password of the user' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'The role ID of the user', required: false })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
