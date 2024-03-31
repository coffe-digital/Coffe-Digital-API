import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
