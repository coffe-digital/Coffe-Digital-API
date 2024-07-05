import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/user-query.dto';
import { Response } from 'express';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @Get()
  @ApiOperation({ summary: 'Find users by email or get all users' })
  @ApiQuery({ name: 'email', required: false, description: 'Email address to filter users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  findByEmail(@Query('email') email?: string) {
    if (!email) {
      return this.userService.findAll(); // Assuming you have a findAll method
    }

    return this.userService.findByEmail(email);
  }

 
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('export/excel')
  async exportToExcel(@Query() queryParams: UserQueryDto, @Res() res: Response) {
    const buffer = await this.userService.exportToExcel(queryParams);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="users_${Date.now()}.xlsx"`,
    });

    res.send(buffer); // Envia o buffer como resposta
  }

  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: UserQueryDto, @Res() res: Response) {
    const buffer = await this.userService.exportToPDF(queryParams);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="users_${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
