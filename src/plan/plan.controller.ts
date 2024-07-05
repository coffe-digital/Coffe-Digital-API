import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanQueryDto } from './dto/plan-query.dto';
import { Response } from 'express';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiResponse({ status: 201, description: 'The plan has been successfully created.' })
  @ApiBody({ type: CreatePlanDto })
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @ApiResponse({ status: 200, description: 'List of all plans.' })
  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Plan found by ID.' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @ApiResponse({ status: 200, description: 'The plan has been successfully updated.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePlanDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @ApiResponse({ status: 204, description: 'The plan has been successfully deleted.' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }

  @ApiResponse({ status: 200, description: 'Plans exported to Excel.' })
  @ApiQuery({ type: PlanQueryDto, required: false })
  @Get('export/excel')
  async exportToExcel(@Query() queryParams: PlanQueryDto, @Res() res: Response) {
    try {
      const { buffer, foundPlans } = await this.planService.exportToExcel(queryParams);

      if (!foundPlans) {
          // Lança NotFoundException se nenhum plano foi encontrado
          throw new NotFoundException('Plan not found');
      }

      res.set({
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="plan_${Date.now()}.xlsx"`,
      });

      res.send(buffer); // Envia o buffer como resposta

    } catch (error) {
        if (error instanceof NotFoundException) {
            // Envia 404 para NotFoundException
            res.status(404).send({
                statusCode: 404,
                message: error.message,
            });
        } else {
            // Loga outros erros e envia resposta 500
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
  }

  @ApiResponse({ status: 200, description: 'Plans exported to PDF.' })
  @ApiQuery({ type: PlanQueryDto, required: false })
  @Get('export/pdf')
  async exportToPDF(@Query() queryParams: PlanQueryDto, @Res() res: Response) {
    try {
        const { buffer, foundPlans } = await this.planService.exportToPDF(queryParams);

        console.log(buffer, foundPlans)
        if (!foundPlans) {
            // Lança NotFoundException se nenhum plano foi encontrado
            throw new NotFoundException('Plans not found');
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="plan_${Date.now()}.pdf"`,
            'Content-Length': buffer.length,
        });

        res.send(buffer); // Envia o buffer como resposta

    } catch (error) {
        if (error instanceof NotFoundException) {
            // Envia 404 para NotFoundException
            res.status(404).send({
                statusCode: 404,
                message: error.message,
            });
        } else {
            // Loga outros erros e envia resposta 500
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal server error',
            });
        }
    }
  }
}
