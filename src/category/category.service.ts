import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { Category } from './entities/category.entity';
  import { PrismaService } from 'src/prisma/prisma.service';
  
  @Injectable()
  export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}
  
    async create(dto: CreateCategoryDto) {
      const categoryExists = await this.prisma.category.findFirst({
        where: { name: dto.name },
      });
  
      if (categoryExists) {
        throw new BadRequestException('Category already exists');
      }
  
      const data = {
        ...dto,
      };
  
      const createdCategory = await this.prisma.category.create({ data });
  
      return {
        ...createdCategory,
      };
    }
  
    async findAll() {
      const categories = await this.prisma.category.findMany();
  
      if (!categories || categories.length === 0) {
        throw new NotFoundException('Category not found');
      }
  
      return categories;
    }
  
    async findOne(id: number) {
      const category = await this.prisma.category.findUnique({
        where: { id: id },
      });
  
      if (!category) {
        throw new NotFoundException('Category not found');
      }
  
      return category;
    }
  
    update(id: number, dto: UpdateCategoryDto) {
      return this.prisma.category.update({
        where: { id },
        data: dto,
      });
    }
  
    async remove(id: number) {
      const relatedProducts = await this.prisma.categoryProduct.findMany({
        where: { categoryId: id },
      });
  
      if (relatedProducts.length > 0) {
        throw new BadRequestException('Category cannot be deleted as it is related to some products.');
      }

      return this.prisma.category.delete({ where: { id } });
    }
  }
  