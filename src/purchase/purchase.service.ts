import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Client } from '../client/entities/client.entity';
import { PurchaseQueryDto } from './dto/purchase-query.dto';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';
import { Payment } from './enum/payment.enum';

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

  async findAll(queryParams?: PurchaseQueryDto) {

    const where = this.buildWhereClause(queryParams);

    const purchases = await this.prisma.purchase.findMany({ where,
      include: {
      client: true,   // Include client details
      product: {
        include: {
          brand: true
        }
      },  // Include product details
      plan: true      // Include plan details
    } });

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

  async exportToExcel(queryParams: PurchaseQueryDto): Promise<{ buffer: Buffer; foundPurchases: boolean }> {
    const purchases = await this.findAll(queryParams);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Purchases');

  // Add headers
  sheet.addRow([
    'Purchase ID',
    'Client ID',
    'Client Phone',
    'Client Birth Date',
    'Client RG',
    'Product ID',
    'Product Bar Code',
    'Product Image',
    'Product Name',
    'Product Price',
    'Product Quantity',
    'Product Brand ID',
    'Product Brand Name',
    'Plan ID',
    'Plan Name',
    'Plan Description',
    'Plan Price',
    'Plan Status',
    'Payday',
    'Payment Method',
    'Payment Status',
    'Canceled',
    'Start Subscription Date',
    'End Subscription Date'
  ]);

  if (purchases.length > 0) {
    // Add data rows
    purchases.forEach(purchase => {
      sheet.addRow([
        purchase.id,
        purchase.client_id,
        purchase.client?.phone,
        purchase.client?.birth_date,
        purchase.client?.rg,
        purchase.product_id,
        purchase.product?.bar_code,
        purchase.product?.image,
        purchase.product?.name,
        purchase.product?.price,
        purchase.product?.quantity,
        purchase.product?.brand_id,
        purchase.product?.brand?.name,
        purchase.plan_id,
        purchase.plan?.name,
        purchase.plan?.description,
        purchase.plan?.price,
        purchase.plan?.status,
        purchase.payday,
        this.getPaymentMethodName(purchase.payment_method),
        purchase.payment_status,
        purchase.canceled,
        purchase.start_subscription_date,
        purchase.end_subscription_date,
      ]);
    });
  } else {
    // Add a row indicating no data
    sheet.addRow(['No data available']);
  }

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;

    // Retorna o buffer e uma flag indicando se planos foram encontrados
    return { buffer, foundPurchases: purchases.length > 0 };
  }

  async exportToPDF(queryParams: PurchaseQueryDto): Promise<{ buffer: Buffer; foundPurchases: boolean }> {
    try {
      const purchases = await this.findAll(queryParams);

      const doc = new PDFKit();
      const buffers: Buffer[] = [];
  
      doc.on('data', buffers.push.bind(buffers));
      doc.fontSize(12);
      doc.text('List of Purchases', { align: 'center' });
      doc.moveDown();

        if (purchases.length > 0) {
          purchases.forEach(purchase => {
            doc.text(`Purchase ID: ${purchase.id}`);
            doc.text(`Client ID: ${purchase.client_id}`);
            doc.text(`Client Phone: ${purchase.client?.phone}`);
            doc.text(`Client Birth Date: ${purchase.client?.birth_date}`);
            doc.text(`Client RG: ${purchase.client?.rg}`);
            doc.text(`Product ID: ${purchase.product_id}`);
            doc.text(`Product Bar Code: ${purchase.product?.bar_code}`);
            doc.text(`Product Image: ${purchase.product?.image}`);
            doc.text(`Product Name: ${purchase.product?.name}`);
            doc.text(`Product Price: ${purchase.product?.price}`);
            doc.text(`Product Quantity: ${purchase.product?.quantity}`);
            doc.text(`Product Brand ID: ${purchase.product?.brand_id}`);
            doc.text(`Product Brand Name: ${purchase.product?.brand?.name}`);
            doc.text(`Plan ID: ${purchase.plan_id}`);
            doc.text(`Plan Name: ${purchase.plan?.name}`);
            doc.text(`Plan Description: ${purchase.plan?.description}`);
            doc.text(`Plan Price: ${purchase.plan?.price}`);
            doc.text(`Plan Status: ${purchase.plan?.status}`);
            doc.text(`Payday: ${purchase.payday}`);
            doc.text(`Payment Method: ${this.getPaymentMethodName(purchase.payment_method)}`);
            doc.text(`Payment Status: ${purchase.payment_status}`);
            doc.text(`Canceled: ${purchase.canceled}`);
            doc.text(`Start Subscription Date: ${purchase.start_subscription_date}`);
            doc.text(`End Subscription Date: ${purchase.end_subscription_date}`);
            doc.moveDown();
          });
        } else {
            doc.text('No data available', { align: 'center' });
        }

        doc.end();

        return new Promise<{ buffer: Buffer; foundPurchases: boolean }>((resolve, reject) => {
            doc.on('end', () => {
                const buffer = Buffer.concat(buffers);
                resolve({ buffer, foundPurchases: purchases.length > 0 });
            });
            doc.on('error', reject);
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error('Failed to export to PDF');
    }
  }

  private buildWhereClause(queryParams?: PurchaseQueryDto): any {
    let where = {};

    if (queryParams) {
      const { client_id, product_id, plan_id, canceled, start_subscription_date, end_subscription_date } = queryParams;

      // Apply filters based on query parameters
      if (client_id) {
        where = {
          ...where,
          client_id: { equals: client_id },
        };
      }

      if (product_id) {
        where = {
          ...where,
          product_id: { equals: product_id },
        };
      }

      if (plan_id) {
        where = {
          ...where,
          plan_id: { equals: plan_id },
        };
      }

      if (canceled !== undefined) {
        where = {
          ...where,
          canceled: { equals: canceled },
        };
      }

      if (start_subscription_date) {
        where = {
          ...where,
          start_subscription_date: { gte: new Date(start_subscription_date) },
        };
      }

      if (end_subscription_date) {
        where = {
          ...where,
          end_subscription_date: { lte: new Date(end_subscription_date) },
        };
      }
      
    }

    return where;
  }

  private getPaymentMethodName(method?: Payment): string {
    switch (method) {
      case Payment.PIX:
        return 'Pix';
      case Payment.BOLETO:
        return 'Boleto';
      case Payment.CREDIT_CARD:
        return 'Cartão de Crédito';
      default:
        return '';
    }
  }
}
