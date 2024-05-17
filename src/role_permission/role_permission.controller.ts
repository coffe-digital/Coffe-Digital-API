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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('role-permissions')
@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role permission' })
  @ApiResponse({ status: 201, description: 'The role permission has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find role permissions' })
  @ApiQuery({ name: 'id', required: false, description: 'Role Permission ID' })
  @ApiQuery({ name: 'roleId', required: false, description: 'Role ID' })
  @ApiQuery({ name: 'permissionId', required: false, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Role permissions retrieved successfully.' })
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
  @ApiOperation({ summary: 'Update a role permission' })
  @ApiParam({ name: 'id', description: 'Role Permission ID' })
  @ApiResponse({ status: 200, description: 'The role permission has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Role permission not found.' })
  update(
    @Param('id') id: string,
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ) {
    return this.rolePermissionService.update(+id, updateRolePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role permission' })
  @ApiParam({ name: 'id', description: 'Role Permission ID' })
  @ApiResponse({ status: 200, description: 'The role permission has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Role permission not found.' })
  remove(@Param('id') id: string) {
    return this.rolePermissionService.remove(+id);
  }
}
