import { IsNumber } from 'class-validator';
import { RolePermission } from '../entities/role_permission.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto extends RolePermission {
  @ApiProperty({ example: 1, description: 'The role ID' })
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1, description: 'The permission ID' })
  @IsNumber()
  permissionId: number;
}
