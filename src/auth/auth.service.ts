import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    };
  }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    return this.login(newUser);
  }

  //   async forgotPassword(email: string): Promise<boolean> {
  //     const user = await this.userService.findByEmail(email);

  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     const token = await this.generatePasswordToken(email);

  //     if (!token) {
  //       throw new Error('Error generating password token');
  //     }

  //     const emailSent = await this.sendForgotPasswordEmail(email, token);

  //     if (!emailSent) {
  //       throw new Error('Error sending forgot password email');
  //     }

  //     return true;
  //   }

  //   private async generatePasswordToken(email: string): Promise<string> {
  //     // Generate a password reset token (e.g., a random string or a JWT with a short expiry time)
  //     // For simplicity, let's assume it's a random 6-digit number
  //     const passwordToken = Math.floor(
  //       100000 + Math.random() * 900000,
  //     ).toString();

  //     // Store the token in your database or cache
  //     // For this example, we'll just log it
  //     console.log(`Password reset token for ${email}: ${passwordToken}`);

  //     return passwordToken;
  //   }
}
