import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryProductDto } from './dto/create-category_product.dto';
import { UpdateCategoryProductDto } from './dto/update-category_product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryProductDto: CreateCategoryProductDto) {
    const { productId, categoryId } = createCategoryProductDto;

    await this.checkProductExists(productId);
    await this.checkCategoryExists(categoryId);

    return this.prisma.categoryProduct.create({ data: createCategoryProductDto });
  }

  async findAll() {
    const categoriesProducts = await this.prisma.categoryProduct.findMany();

    if (!categoriesProducts || categoriesProducts.length === 0) {
      throw new NotFoundException('Categories-Products not found');
    }

    return categoriesProducts;
  }

  async findById(id: number) {
    const categoriesProducts = await this.prisma.categoryProduct.findUnique({
      where: { id: id },
    });

    if (!categoriesProducts) {
      throw new NotFoundException('Categories Product not found');
    }

    return categoriesProducts;
  }

  async findCategoriesByProduct(productId: number) {
    const categoriesProducts = await this.prisma.categoryProduct.findMany({
      where: { productId: productId },
    });

    if (!categoriesProducts || categoriesProducts.length === 0) {
      throw new NotFoundException('Categories not found for product');
    }

    return categoriesProducts;
  }

  async findProductsByCategory(categoryId: number) {
    const categoriesProducts = await this.prisma.categoryProduct.findMany({
      where: { categoryId: categoryId },
    });

    if (!categoriesProducts || categoriesProducts.length === 0) {
      throw new NotFoundException('Products not found for category');
    }

    return categoriesProducts;
  }

  async findByCategoryAndProduct(categoryId: number, productId: number) {
    const categoriesProducts = await this.prisma.categoryProduct.findFirst({
      where: {
        AND: [{ categoryId: categoryId }, { productId: productId }],
      },
    });

    if (!categoriesProducts) {
      throw new NotFoundException('Product not found for category');
    }

    return categoriesProducts;
  }

  async update(id: number, updateCategoryProductDto: UpdateCategoryProductDto) {
    const { productId, categoryId } = updateCategoryProductDto;

    await this.checkProductExists(productId);
    await this.checkCategoryExists(categoryId);

    return this.prisma.categoryProduct.update({
      where: { id },
      data: updateCategoryProductDto,
    });
  }

  async remove(id: number) {
    const categoriesProducts = await this.prisma.categoryProduct.findUnique({
      where: { id },
    });

    if (!categoriesProducts) {
      throw new NotFoundException('Category-Product not found');
    }

    return this.prisma.categoryProduct.delete({ where: { id } });
  }

  private async checkProductExists(productId: number) {
    const product = await this.prisma.product.findFirst({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  private async checkCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }
}
