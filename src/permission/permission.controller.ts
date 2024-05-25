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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'The permission has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  // @Get()
  // findAll() {
  //   return this.permissionService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: 'Get permissions by ID or all permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully.' })
  findById(@Query('id') id?: string) {
    if (!id) {
      return this.permissionService.findAll(); // Assuming you have a findAll method
    }

    return this.permissionService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'The permission has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'The permission has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
