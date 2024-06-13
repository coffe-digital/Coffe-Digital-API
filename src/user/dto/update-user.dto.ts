import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 'user@example.com', description: 'The email of the user' })
    email?: string;

    @ApiPropertyOptional({ example: 'StrongP@ssw0rd', description: 'The password of the user' })
    password?: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'The name of the user' })
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'The role ID of the user', required: false })
    roleId?: number;
}
