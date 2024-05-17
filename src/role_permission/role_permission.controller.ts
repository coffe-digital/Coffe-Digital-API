import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findById(
    @Query('id') id?: string,
    @Query('roleId') roleId?: string,
    @Query('permissionId') permissionId?: string,
  ) {
    if (roleId && permissionId) {
      return this.rolePermissionService.findByRolesAndPermission(
        +permissionId,
        +roleId,
      );
    }

    if (roleId) {
      return this.rolePermissionService.findPermissionsByRole(+roleId);
    }

    if (permissionId) {
      return this.rolePermissionService.findRolesByPermission(+permissionId);
    }

    if (id) {
      return this.rolePermissionService.findById(+id);
    }

    return this.rolePermissionService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionService.update(+id, updateRolePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionService.remove(+id);
  }
}
