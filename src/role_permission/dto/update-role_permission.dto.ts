import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './create-role_permission.dto';

export class UpdateRolePermissionDto extends PartialType(
  CreateRolePermissionDto,
) {
  @ApiPropertyOptional({ example: 1, description: 'The role ID' })
  roleId?: number;

  @ApiPropertyOptional({ example: 1, description: 'The permission ID' })
  permissionId?: number;
}
