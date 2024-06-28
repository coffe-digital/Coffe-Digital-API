import { IsBoolean, IsString, IsNumber, Matches, IsOptional, IsDate, IsDateString } from 'class-validator'
import { Purchase } from '../entities/purchase.entity';
import { Transform, Type } from 'class-transformer';

export class CreatePurchaseDto extends Purchase{
    @IsString()
    type: string;
    
    @IsNumber()
    client_id: number;

    @IsOptional()
    @IsNumber()
    product_id: number;

    @IsOptional()
    @IsNumber()
    plan_id: number;

    @IsNumber()
    payday: number;

    @IsNumber()
    payment_method: number;

    @IsBoolean()
    payment_status: boolean;

    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
    start_subscription_date: string;

    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
    end_subscription_date: string;

    @IsBoolean()
    canceled: boolean;
}
