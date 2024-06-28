import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileDTO } from './dto/file.dto';
import { SupabaseService } from 'src/integration/supabase.service';
import { Response } from 'express';
import { ProductQueryDto } from './dto/product-query.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: FileDTO) {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: FileDTO) {
    return this.productService.update(+id, updateProductDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get('export/excel')
  async exportToExcel(@Query() queryParams: ProductQueryDto, @Res() res: Response) {
    const buffer = await this.productService.exportToExcel(queryParams);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="products_${Date.now()}.xlsx"`,
    });

    res.send(buffer); // Envia o buffer como resposta
  }

  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: ProductQueryDto, @Res() res: Response) {
    const buffer = await this.productService.exportToPDF(queryParams);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="products_${Date.now()}.pdf"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
