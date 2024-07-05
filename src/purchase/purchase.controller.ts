import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  Query,
  Res
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PurchaseQueryDto } from './dto/purchase-query.dto';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiResponse({ status: 201, description: 'Purchase created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all purchases' })
  @ApiResponse({ status: 200, description: 'List of all purchases.' })
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a purchase by ID' })
  @ApiResponse({ status: 200, description: 'Purchase found.' })
  @ApiResponse({ status: 404, description: 'Purchase not found.' })
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a purchase' })
  @ApiResponse({ status: 200, description: 'Purchase updated.' })
  @ApiResponse({ status: 404, description: 'Purchase not found.' })
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.update(+id, updatePurchaseDto);
  }

  @Get('export/excel')
  async exportToExcel(@Query() queryParams: PurchaseQueryDto, @Res() res: Response) {
    try {
      const { buffer, foundPurchases } = await this.purchaseService.exportToExcel(queryParams);

      if (!foundPurchases) {
          // Lança NotFoundException se nenhuma compra foi encontrada
          throw new NotFoundException('Purchases not found');
      }

      res.set({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="purchase_${Date.now()}.xlsx"`,
      });

      res.send(buffer); // Envia o buffer como resposta

    } catch (error) {
        if (error instanceof NotFoundException) {
            // Envia 404 para NotFoundException
            res.status(404).send({
                statusCode: 404,
                message: error.message,
            });
        } else {
            // Loga outros erros e envia resposta 500
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
  }

  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: PurchaseQueryDto, @Res() res: Response) {
    try {
        const { buffer, foundPurchases } = await this.purchaseService.exportToPDF(queryParams);

        console.log(buffer, foundPurchases)
        if (!foundPurchases) {
            // Lança NotFoundException se nenhuma compra foi encontrada
            throw new NotFoundException('Purchases not found');
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="purchase_${Date.now()}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.send(buffer); // Envia o buffer como resposta

    } catch (error) {
        if (error instanceof NotFoundException) {
            // Envia 404 para NotFoundException
            res.status(404).send({
                statusCode: 404,
                message: error.message,
            });
        } else {
            // Loga outros erros e envia resposta 500
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
  }
}
