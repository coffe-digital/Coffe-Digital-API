import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}


  async create(createPurchaseDto: CreatePurchaseDto) {

    // Verifica se o produto existe
    if (createPurchaseDto.product_id) {
      const product = await this.prisma.product.findUnique({
        where: { id: createPurchaseDto.product_id },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    // Verifica se o plano existe
    if (createPurchaseDto.plan_id) {
      const plan = await this.prisma.plan.findUnique({
        where: { id: createPurchaseDto.plan_id },
      });
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }
    }

    // Verifica se o cliente existe
    if (createPurchaseDto.client_id) {
      const client = await this.prisma.client.findUnique({
        where: { id: createPurchaseDto.client_id },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
    }

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

  //nao pode apagar - só cancelar a compra
  // remove(id: number) {
  //   return this.prisma.purchase.delete({ where: { id } });
  // }
}
