import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @ApiPropertyOptional({ example: 'read', description: 'The name of the permission' })
    name?: string;
}
