import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all brands' })
  @ApiResponse({ status: 200, description: 'List of all brands.' })
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand found.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiResponse({ status: 200, description: 'Brand updated.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiResponse({ status: 200, description: 'Brand deleted.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
