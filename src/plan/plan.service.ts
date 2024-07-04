import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlanQueryDto } from './dto/plan-query.dto';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    const planExists = await this.prisma.plan.findFirst({
      where: { name: createPlanDto.name },
    });

    if (planExists) {
      throw new BadRequestException('Plan already exists');
    }

    const data = {
      ...createPlanDto,
    };

    const createdPlan = await this.prisma.plan.create({ data });

    return {
      ...createdPlan,
    };
  }

  async findAll(queryParams?: PlanQueryDto): Promise<any[]> {
    let where = this.buildWhereClause(queryParams);

    const plans = await this.prisma.plan.findMany({
      where,
    });

    if (!plans || plans.length === 0) {
      throw new NotFoundException('Plans not found');
    }

    return plans;
  }

  findOne(id: number) {
    const plan = this.prisma.plan.findUnique({
      where: { id: id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  remove(id: number) {
    return this.prisma.plan.delete({ where: { id } });
  }

  async exportToExcel(queryParams: PlanQueryDto): Promise<{ buffer: Buffer; foundPlans: boolean }> {
    const plans = await this.findAll(queryParams);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Plans');

    // Adiciona cabeçalhos
    sheet.addRow(['ID', 'Name', 'Description', 'Price', 'Status']);

    if (plans.length > 0) {
        // Adiciona dados dos produtos
        plans.forEach(plan => {
            sheet.addRow([
                plan.id,
                plan.name,
                plan.description,
                plan.price,
                plan.status,
            ]);
        });
    } else {
        // Adiciona uma linha indicando que não há dados
        sheet.addRow(['No data available']);
    }

    const buffer = await workbook.xlsx.writeBuffer() as Buffer;

    // Retorna o buffer e uma flag indicando se planos foram encontrados
    return { buffer, foundPlans: plans.length > 0 };
  }

  async exportToPDF(queryParams: PlanQueryDto): Promise<{ buffer: Buffer; foundPlans: boolean }> {
    try {
        const plans = await this.findAll(queryParams);

        const doc = new PDFKit();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.fontSize(12);
        doc.text('List of Plans', { align: 'center' });
        doc.moveDown();

        if (plans.length > 0) {
            plans.forEach(plan => {
                doc.text(`ID: ${plan.id}`);
                doc.text(`Name: ${plan.name}`);
                doc.text(`Description: ${plan.description}`);
                doc.text(`Price: ${plan.price}`);
                doc.text(`Status: ${plan.status}`);
                doc.moveDown();
            });
        } else {
            doc.text('No data available', { align: 'center' });
        }

        doc.end();

        return new Promise<{ buffer: Buffer; foundPlans: boolean }>((resolve, reject) => {
            doc.on('end', () => {
                const buffer = Buffer.concat(buffers);
                resolve({ buffer, foundPlans: plans.length > 0 });
            });
            doc.on('error', reject);
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error('Failed to export to PDF');
    }
  }

  private buildWhereClause(queryParams?: PlanQueryDto): any {
    let where = {};

    if (queryParams) {
      const { name, description, minPrice, maxPrice } = queryParams;

      // Aplica filtros com base nos parâmetros de consulta
      if (name) {
        where = {
          ...where,
          name: { contains: name, mode: 'insensitive' },
        };
      }
  
      if (description) {
        where = {
          ...where,
          description: { contains: description, mode: 'insensitive' },
        };
      }

      if (minPrice !== undefined && maxPrice !== undefined) {
        where = {
          ...where,
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        };
      } else if (minPrice !== undefined) {
        where = {
          ...where,
          price: {
            gte: minPrice,
          },
        };
      } else if (maxPrice !== undefined) {
        where = {
          ...where,
          price: {
            lte: maxPrice,
          },
        };
      }
    }

    return where;
  }
}
