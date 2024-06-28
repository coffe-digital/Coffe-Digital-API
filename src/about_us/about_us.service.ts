import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAboutUsDto } from './dto/create-about_us.dto';
import { UpdateAboutUsDto } from './dto/update-about_us.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AboutUsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAboutUsDto: CreateAboutUsDto) {
    const data = {
      ...createAboutUsDto,
    };

    const createdAboutUs = await this.prisma.aboutUs.create({ data });

    return {
      ...createdAboutUs,
    };
  }

  async findAll() {
    const aboutUs = await this.prisma.aboutUs.findMany();

    if (!aboutUs || aboutUs.length === 0) {
      throw new NotFoundException('About us infos not found');
    }

    return aboutUs;
  }

  findOne(id: number) {
    const aboutUs = this.prisma.aboutUs.findUnique({
      where: { id: id },
    });

    if (!aboutUs) {
      throw new NotFoundException('About us info not found');
    }

    return aboutUs;
  }

  update(id: number, updateAboutUsDto: UpdateAboutUsDto) {
    return this.prisma.aboutUs.update({
      where: { id },
      data: updateAboutUsDto,
    });
  }

  remove(id: number) {
    return this.prisma.aboutUs.delete({ where: { id } });
  }
}
