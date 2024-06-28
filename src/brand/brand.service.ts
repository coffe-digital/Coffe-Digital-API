import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const data = {
      ...createBrandDto,
    };

    const createdBrand = await this.prisma.brand.create({ data });

    return {
      ...createdBrand,
    };
  }

  async findAll() {
    const brands = await this.prisma.brand.findMany();

    if (!brands || brands.length === 0) {
      throw new NotFoundException('Brands not found');
    }

    return brands;
  }

  findOne(id: number) {
    const brand = this.prisma.brand.findUnique({
      where: { id: id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  remove(id: number) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
