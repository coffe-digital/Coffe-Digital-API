import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {

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
    };

    const createdProduct = await this.prisma.product.create({ data });

    return {
      ...createdProduct,
    };
  }

  async findAll() {
    const products = await this.prisma.product.findMany();

    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  findOne(id: number) {
    const product = this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
