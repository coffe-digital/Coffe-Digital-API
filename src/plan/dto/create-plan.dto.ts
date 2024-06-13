import { IsBoolean, IsString, IsDecimal, IsNumber } from 'class-validator'
import {Plan} from '../entities/plan.entity'
import { Decimal } from '@prisma/client/runtime/library';

export class CreatePlanDto extends Plan {
    
    @IsString()
    name: string;
    
    @IsString()
    description: string;
    
    @IsBoolean()
    status: boolean;

    @IsNumber()
    price: number;
    
}
