import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { connect } from 'http2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    if (createUserDto.roleId !== undefined) {
      const idRole = await this.prisma.role.findUnique({
        where: {id: createUserDto.roleId}
      });

      if (!idRole) {
        throw new BadRequestException('Role not exists')
      }
    }
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10), 
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findByEmail(query: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: query },
    });

    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    if (!users || users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, UpdateUserDto: UpdateUserDto) {

    const idRole = await this.prisma.role.findUnique({
      where: {id: UpdateUserDto.roleId}
    });

    if (!idRole) {
      throw new BadRequestException('Role not exists')
    }

    return this.prisma.user.update({
      where: { id },
      data: UpdateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      ...updatedUser,
      password: undefined,
    };
  }
}
