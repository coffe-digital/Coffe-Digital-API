import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ClientQueryDto } from './dto/client-query.dto';
import { Response } from 'express';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @IsPublic()
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }

  @Get('export/excel')
  async exportToExcel(@Query() queryParams: ClientQueryDto, @Res() res: Response) {
    const buffer = await this.clientService.exportToExcel(queryParams);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="clients_${Date.now()}.xlsx"`,
    });

    res.send(buffer); // Envia o buffer como resposta
  }

  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: ClientQueryDto, @Res() res: Response) {
    const buffer = await this.clientService.exportToPDF(queryParams);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="clients_${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
