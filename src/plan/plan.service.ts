import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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

  async findAll() {
    const plans = await this.prisma.plan.findMany();

    if (!plans || plans.length === 0) {
      throw new NotFoundException('plans not found');
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
}
