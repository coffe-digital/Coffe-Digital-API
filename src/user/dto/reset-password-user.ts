import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

export class ResetPasswordDto extends User {
  @IsEmail()
  email: string;
}
