import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}


  async create(createPurchaseDto: CreatePurchaseDto) {
    const data = {
      ...createPurchaseDto,
    };

    const createdPurchase = await this.prisma.purchase.create({ data });

    return {
      ...createdPurchase,
    };
  }

  async findAll() {
    const purchases = await this.prisma.purchase.findMany();

    if (!purchases || purchases.length === 0) {
      throw new NotFoundException('Purchases not found');
    }

    return purchases;
  }

  findOne(id: number) {
    const purchase = this.prisma.purchase.findUnique({
      where: { id: id },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return this.prisma.purchase.update({
      where: { id },
      data: updatePurchaseDto,
    });
  }

  remove(id: number) {
    return this.prisma.purchase.delete({ where: { id } });
  }
}
