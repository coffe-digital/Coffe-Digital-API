import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { CreateContactDto } from './dto/create-contact.dto';
  import { ContactService } from './contact.service';
  import { UpdateContactDto } from './dto/update-contact.dto';
  import { IsPublic } from 'src/auth/decorators/is-public.decorator';
  import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}
  
    @ApiResponse({ status: 201, description: 'The contact has been successfully created.' })
    @ApiBody({ type: CreateContactDto })
    @Post()
    create(@Body() createContactDto: CreateContactDto) {
      return this.contactService.create(createContactDto);
    }
  
    @ApiResponse({ status: 200, description: 'Contact found by ID.' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.contactService.findOne(+id);
    }
  
    @ApiResponse({ status: 200, description: 'List of all contacts.' })
    @Get()
    findAll() {
      return this.contactService.findAll();
    }
  
    @ApiResponse({ status: 200, description: 'The contact has been successfully updated.' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateContactDto })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
      return this.contactService.update(+id, updateContactDto);
    }
  
    @ApiResponse({ status: 204, description: 'The contact has been successfully deleted.' })
    @ApiParam({ name: 'id', type: Number })
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.contactService.remove(+id);
    }
  }
  