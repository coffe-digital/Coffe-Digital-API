import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressService } from './address.service';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @IsPublic()
  @ApiResponse({ status: 201, description: 'The address has been successfully created.' })
  @ApiBody({ type: CreateAddressDto })
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @ApiResponse({ status: 200, description: 'List of all addresses.' })
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Address found by ID.' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.addressService.findById(+id);
  }

  @ApiResponse({ status: 200, description: 'The address has been successfully updated.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAddressDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.addressService.findByClient(+clientId);
  }

  @ApiResponse({ status: 204, description: 'The address has been successfully deleted.' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
