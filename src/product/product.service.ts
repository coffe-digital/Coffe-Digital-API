import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs-extra';
import { Buffer } from 'buffer'; // Importe o Buffer corretamente
import { FileDTO } from './dto/file.dto';
import { SupabaseService } from 'src/integration/supabase.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService
    ) {}

  async create(createProductDto: CreateProductDto, file: FileDTO) {

    if (!file) {
      throw new Error('Failed to upload image');
    }

    let imagePath = await this.supabaseService.uploadImage(file);

    if (createProductDto.brand_id) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: createProductDto.brand_id },
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const data = {
      ...createProductDto,
      image: imagePath,
    };

    const createdProduct = await this.prisma.product.create({ data });

    return {
      ...createdProduct,
    };
  }

  async findAll(queryParams?: ProductQueryDto): Promise<any[]> {

    let where = this.buildWhereClause(queryParams);

    const products = await this.prisma.product.findMany({
      where,
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }

    for (const product of products) {
      if (product.image) {
        product.image = await this.supabaseService.getPublicUrl(product.image);
      }
    }

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product && product.image) {
      product.image = await this.supabaseService.getPublicUrl(product.image);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, file: FileDTO) {
    let imagePath: string;

    if (file) {
      imagePath = await this.supabaseService.uploadImage(file);
      updateProductDto.image = imagePath;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return {
      ...updatedProduct,
    };
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.image) {
      await this.supabaseService.deleteImage(product.image);
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async exportToExcel(queryParams: ProductQueryDto): Promise<Buffer> {
    try {
      const products = await this.findAll(queryParams);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Products');

      // Adiciona cabeçalhos
      sheet.addRow(['ID', 'Name', 'Description', 'Price', 'Quantity', 'Bar Code', 'Image URL']);

      // Adiciona dados dos produtos
      products.forEach(product => {
        sheet.addRow([
          product.id,
          product.name,
          product.description,
          product.price,
          product.quantity,
          product.bar_code,
          product.image || '', // Adicione o URL da imagem, se existir
        ]);
      });

      return await workbook.xlsx.writeBuffer() as Buffer;

    } catch (error) {
      throw new Error('Failed to export to Excel');
    }
  }

  async exportToPDF(queryParams: ProductQueryDto): Promise<Buffer> {
    try {
      const products = await this.findAll(queryParams);

      const doc = new PDFKit();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});
      doc.fontSize(12);
      doc.text('List of Products', { align: 'center' });
      doc.moveDown();

      products.forEach(product => {
        doc.text(`ID: ${product.id}`);
        doc.text(`Name: ${product.name}`);
        doc.text(`Description: ${product.description}`);
        doc.text(`Price: ${product.price}`);
        doc.text(`Quantity: ${product.quantity}`);
        doc.text(`Bar Code: ${product.bar_code}`);
        doc.text(`Image URL: ${product.image || ''}`); // Adicione o URL da imagem, se existir
        doc.moveDown();
      });

      doc.end();

      return new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => {
          const buffer = Buffer.concat(buffers);
          resolve(buffer);
        });
        doc.on('error', reject);
      });
      
    } catch (error) {
      throw new Error('Failed to export to PDF');
    }
  }

  private buildWhereClause(queryParams?: ProductQueryDto): any {
    let where = {};

    if (queryParams) {
      const { name, description, bar_code, minPrice, maxPrice, minQuantity, maxQuantity } = queryParams;

      // Aplica filtros com base nos parâmetros de consulta
      if (name || description || bar_code) {
        where = {
          ...where,
          OR: [
            { name: { contains: name, mode: 'insensitive' } },
            { description: { contains: description, mode: 'insensitive' } },
            { bar_code: { contains: bar_code, mode: 'insensitive' } },
          ],
        };
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        where = {
          ...where,
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        };
      } else if (minPrice !== undefined) {
        where = {
          ...where,
          price: {
            gte: minPrice,
          },
        };
      } else if (maxPrice !== undefined) {
        where = {
          ...where,
          price: {
            lte: maxPrice,
          },
        };
      }

      if (minQuantity !== undefined && maxQuantity !== undefined) {
        where = {
          ...where,
          quantity: {
            gte: minQuantity,
            lte: maxQuantity,
          },
        };
      } else if (minQuantity !== undefined) {
        where = {
          ...where,
          quantity: {
            gte: minQuantity,
          },
        };
      } else if (maxQuantity !== undefined) {
        where = {
          ...where,
          quantity: {
            lte: maxQuantity,
          },
        };
      }
    }

    return where;
  }
}
