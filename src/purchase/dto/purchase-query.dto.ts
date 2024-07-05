import { IsOptional, IsNumber, IsString, IsNotEmpty, IsBoolean, Matches, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Payment } from '../enum/payment.enum';

export class PurchaseQueryDto {
  @ApiPropertyOptional({ description: 'Type of purchase' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @ApiPropertyOptional({ description: 'ID of the client' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  client_id?: string;

  @ApiPropertyOptional({ description: 'ID of the product' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ description: 'ID of the plan' })
  @IsOptional()
  @IsNumber()
  plan_id?: number;

  @ApiPropertyOptional({ description: 'Payday of the subscription' })
  @IsOptional()
  @IsNumber()
  payday?: number;

  @ApiPropertyOptional({ description: 'Payment method' })
  @IsOptional()
  @IsEnum(Payment)
  payment_method?: Payment;

  @ApiPropertyOptional({ description: 'Payment status' })
  @IsOptional()
  @IsBoolean()
  payment_status?: boolean;

  @ApiPropertyOptional({ description: 'Whether the subscription is canceled' })
  @IsOptional()
  @IsBoolean()
  canceled?: boolean;

  @ApiPropertyOptional({ description: 'Start date of the subscription' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
  start_subscription_date?: string;

  @ApiPropertyOptional({ description: 'End date of the subscription' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'end_subscription_date must be in the format dd/mm/yyyy' })
  end_subscription_date?: string;
}
