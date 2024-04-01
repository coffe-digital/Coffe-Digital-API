import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthRequest } from './models/AuthRequest';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from './decorators/is-public.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) //login depende desse guardiao para funcionar
  login(@Request() req: AuthRequest) {
    return this.AuthService.login(req.user);
  }

  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.AuthService.register(createUserDto);
  }
}
