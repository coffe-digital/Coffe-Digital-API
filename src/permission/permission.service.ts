import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const formattedName =
      createPermissionDto.name.charAt(0).toUpperCase() +
      createPermissionDto.name.slice(1);

    const permissionExists = await this.prisma.permission.findFirst({
      where: { name: formattedName },
    });

    if (permissionExists) {
      throw new BadRequestException('Permission already exists');
    }

    const data = {
      ...createPermissionDto,
    };

    const createdPermission = await this.prisma.permission.create({ data });

    return {
      ...createdPermission,
    };
  }

  async findAll() {
    const permissions = await this.prisma.permission.findMany();

    if (!permissions || permissions.length === 0) {
      throw new NotFoundException('Permissions not found');
    }

    return permissions;
  }

  async findById(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  remove(id: number) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
