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
  import { CreateAddressDto } from './dto/create-address.dto';
  import { AddressService } from './address.service';
  import { UpdateAddressDto } from './dto/update-address.dto';
  import { IsPublic } from 'src/auth/decorators/is-public.decorator';
  
  @Controller('address')
  export class AddressController {
    constructor(private readonly addressService: AddressService) {}
  
    @IsPublic()
    @Post()
    create(@Body() createAddressDto: CreateAddressDto) {
      return this.addressService.create(createAddressDto);
    }
  
    @Get()
    findAll() {
        return this.addressService.findAll();
    }
  
    /*@Get(':id')
    findById(@Param('id') id: string) {
      return this.addressService.findById(+id);
    }*/

    @Get(':clientId')
    findByClient(@Param('clientId') clientId: string) {
      return this.addressService.findByClient(+clientId);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
      return this.addressService.update(+id, updateAddressDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.addressService.remove(+id);
    }
  }
  