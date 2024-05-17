import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
//import { Role } from './entities/role.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const roleExists = await this.prisma.role.findFirst({
      where: { name: dto.name },
    });

    if (roleExists) {
      throw new BadRequestException('Role already exists');
    }

    const data = {
      ...dto,
    };

    const createdRole = await this.prisma.role.create({ data });

    return {
      ...createdRole,
    };
  }

  async findAll() {
    const roles = await this.prisma.role.findMany();

    if (!roles || roles.length === 0) {
      throw new NotFoundException('Roles not found');
    }

    return roles;
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  update(id: number, dto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
