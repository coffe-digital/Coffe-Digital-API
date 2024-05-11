import { IsNumber } from 'class-validator';
import { RolePermission } from '../entities/role_permission.entity';

export class CreateRolePermissionDto extends RolePermission {
  @IsNumber()
  roleId: number;

  @IsNumber()
  permissionId: number;
}
