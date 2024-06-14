import { IsString } from 'class-validator';
import { Role } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto extends Role {
  @ApiProperty({ example: 'Admin', description: 'The name of the role' })
  @IsString()
  name: string;
}
