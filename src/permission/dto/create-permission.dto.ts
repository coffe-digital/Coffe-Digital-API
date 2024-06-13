import { IsString } from 'class-validator';
import { Permission } from '../entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto extends Permission {
  @ApiProperty({ example: 'read', description: 'The name of the permission' })
  @IsString()
  name: string;
}
