import { IsOptional, IsNumber, IsString, IsNotEmpty, IsBoolean, Matches, IsEnum } from 'class-validator';
import { Payment } from '../enum/payment.enum';

export class PurchaseQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client_id?: string;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsNumber()
  plan_id?: number;

  @IsOptional()
  @IsNumber()
  payday?: number;

  @IsOptional()
  @IsEnum(Payment)
  payment_method?: Payment;

  @IsOptional()
  @IsBoolean()
  payment_status?: boolean;

  @IsOptional()
  @IsBoolean()
  canceled?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
  start_subscription_date: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'end_subscription_date must be in the format dd/mm/yyyy' })
  end_subscription_date: string;
}
