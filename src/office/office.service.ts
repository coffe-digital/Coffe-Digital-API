import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Office } from './entities/office.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OfficeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOfficeDto) {
    const officeExists = await this.prisma.office.findUnique({
      where: { name: dto.name },
    });

    if (officeExists) {
      throw new BadRequestException('Office already exists');
    }

    const office = await this.prisma.office.create(dto);
    return office;
  }

  async findAll() {
    const offices = await this.prisma.office.findMany();

    if (!offices || offices.length === 0) {
      throw new NotFoundException('Offices not found');
    }

    return offices;
  }

  findOne(id: number) {
    return this.prisma.office.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateOfficeDto) {
    return this.prisma.office.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.office.delete({ where: { id } });
  }

}
