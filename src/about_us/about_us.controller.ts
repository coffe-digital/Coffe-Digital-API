import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('about-us')
@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new about us entry' })
  @ApiResponse({ status: 201, description: 'About us entry created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createAboutUsDto: CreateAboutUsDto) {
    return this.aboutUsService.create(createAboutUsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all about us entries' })
  @ApiResponse({ status: 200, description: 'List of all about us entries.' })
  findAll() {
    return this.aboutUsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an about us entry by ID' })
  @ApiResponse({ status: 200, description: 'About us entry found.' })
  @ApiResponse({ status: 404, description: 'About us entry not found.' })
  findOne(@Param('id') id: string) {
    return this.aboutUsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an about us entry' })
  @ApiResponse({ status: 200, description: 'About us entry updated.' })
  @ApiResponse({ status: 404, description: 'About us entry not found.' })
  update(@Param('id') id: string, @Body() updateAboutUsDto: UpdateAboutUsDto) {
    return this.aboutUsService.update(+id, updateAboutUsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an about us entry by ID' })
  @ApiResponse({ status: 200, description: 'About us entry deleted.' })
  @ApiResponse({ status: 404, description: 'About us entry not found.' })
  remove(@Param('id') id: string) {
    return this.aboutUsService.remove(+id);
  }
}
