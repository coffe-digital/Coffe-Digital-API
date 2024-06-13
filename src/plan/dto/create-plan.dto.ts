import { IsBoolean, IsString, IsNumber } from 'class-validator'
import {Plan} from '../entities/plan.entity'

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
