import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
    constructor(private readonly: PlanService){}

    @Get()
    find_all(){
        return 'lista de planos aqui';
    }

    @Get(':id')
    find_one(@Param('id') id: string){
        return `1 curso aqui: ${id}`;
    }

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    create_plan(@Body() body){
        return body;
    }

}
