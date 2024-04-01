import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return String(process.env.APP_ENVIRONMENT);
  }

  // @Get('me')
  // me(@CurrentUser() user: User) {
  //   return user;
  // }
}
