import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    const { roleId, permissionId } = createRolePermissionDto;

    await this.checkRoleExists(roleId);
    await this.checkPermissionExists(permissionId);

    return this.prisma.rolePermission.create({ data: createRolePermissionDto });
  }

  async findAll() {
    const rolesPermissions = await this.prisma.rolePermission.findMany();

    if (!rolesPermissions || rolesPermissions.length === 0) {
      throw new NotFoundException('Roles-Permissions not found');
    }

    return rolesPermissions;
  }

  async findById(id: number) {
    const rolesPermissions = await this.prisma.rolePermission.findUnique({
      where: { id: id },
    });

    if (!rolesPermissions) {
      throw new NotFoundException('Roles Permission not found');
    }

    return rolesPermissions;
  }

  async findPermissionsByRole(roleId: number) {
    const rolesPermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: roleId },
    });

    if (!rolesPermissions || rolesPermissions.length === 0) {
      throw new NotFoundException('Permissions not found for role');
    }

    return rolesPermissions;
  }

  async findRolesByPermission(permissionId: number) {
    const rolesPermissions = await this.prisma.rolePermission.findMany({
      where: { permissionId: permissionId },
    });

    if (!rolesPermissions || rolesPermissions.length === 0) {
      throw new NotFoundException('Roles not found for permision');
    }

    return rolesPermissions;
  }

  async findByRolesAndPermission(permissionId: number, roleId: number) {
    const rolesPermissions = await this.prisma.rolePermission.findFirst({
      where: {
        AND: [{ permissionId: permissionId }, { roleId: roleId }],
      },
    });

    if (!rolesPermissions) {
      throw new NotFoundException('Roles not found for permision');
    }

    return rolesPermissions;
  }

  async update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
    const { roleId, permissionId } = updateRolePermissionDto;

    await this.checkRoleExists(roleId);
    await this.checkPermissionExists(permissionId);

    return this.prisma.rolePermission.update({
      where: { id },
      data: updateRolePermissionDto,
    });
  }

  async remove(id: number) {
    const rolesPermissions = await this.prisma.rolePermission.findUnique({
      where: { id },
    });

    if (!rolesPermissions) {
      throw new NotFoundException('Role-Permission not found');
    }

    return this.prisma.rolePermission.delete({ where: { id } });
  }

  private async checkRoleExists(roleId: number) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  }

  private async checkPermissionExists(permissionId: number) {
    const permission = await this.prisma.permission.findFirst({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
  }
}
