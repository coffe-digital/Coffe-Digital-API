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
  
  @Controller('contact')
  export class ContactController {
    constructor(private readonly contactService: ContactService) {}
  
    @IsPublic()
    @Post()
    create(@Body() createContactDto: CreateContactDto) {
      return this.contactService.create(createContactDto);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.contactService.findOne(+id);
    }
  
    @Get()
    findAll() {
      return this.contactService.findAll();
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
      return this.contactService.update(+id, updateContactDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.contactService.remove(+id);
    }
  }
  