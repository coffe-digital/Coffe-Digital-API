import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResetPasswordDto } from 'src/user/dto/reset-password-user';
import { EmailService } from 'src/mail/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPassword = await bcrypt.compare(password, user.password);

      if (isPassword) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Email addres or password provided is incorrect.');
  }

  login(user: User): UserToken {
    //transform user in jwt
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
      email: user.email,
      name: user.name,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    return this.login(newUser);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(resetPasswordDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPassword = await this.generatePassword();

    if (!newPassword) {
      throw new Error('Error generating new password');
    }

    if (this.userService.updatePassword(user.id, newPassword)) {
      await this.emailService.sendPasswordResetEmail(user.email);

      return {
        message:
          'Password reset successful. Your new password is: ' + newPassword,
      };
    }

    throw new Error('Error update new password');
  }

  private async generatePassword(): Promise<string> {
    const length = 10;
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%';

    const allChars = upperChars + lowerChars + numbers + specialChars;
    let password = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * allChars.length);
      password += allChars[index];
    }

    return password;
  }
}
