import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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

    const data = {
      ...createProductDto,
      image: imagePath,
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
