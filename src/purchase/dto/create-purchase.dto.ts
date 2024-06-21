import { IsBoolean, IsString, IsNumber, Matches } from 'class-validator'
import { Purchase } from '../entities/purchase.entity';

export class CreatePurchaseDto extends Purchase{
    @IsString()
    type: string;
    
    @IsNumber()
    client_id: number;

    @IsNumber()
    product_id: number;

    @IsNumber()
    plan_id: number;

    @IsNumber()
    payday: number;

    @IsNumber()
    payment_method: number;

    @IsBoolean()
    payment_status: boolean;

    @IsNumber()
    start_subscription_date: number;

    @IsNumber()
    end_subscription_date: number;

    @IsBoolean()
    canceled: boolean;
}
