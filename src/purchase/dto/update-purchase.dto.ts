import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { Payment } from '../enum/payment.enum';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @ApiPropertyOptional({ example: 'Subscription', description: 'Type of purchase' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the client' })
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID of the product' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ example: 3, description: 'ID of the plan' })
  @IsOptional()
  @IsNumber()
  plan_id?: number;

  @ApiPropertyOptional({ example: 15, description: 'Payday of the subscription' })
  @IsOptional()
  @IsNumber()
  payday?: number;

  @ApiPropertyOptional({ example: 1, description: 'Payment method ID' })
  @IsOptional()
  @IsEnum(Payment)
  payment_method?: Payment;

  @ApiPropertyOptional({ example: true, description: 'Payment status' })
  @IsOptional()
  @IsBoolean()
  payment_status?: boolean;

  @ApiPropertyOptional({ example: '07/07/2024', description: 'Start date of the subscription' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
  start_subscription_date?: string;

  @ApiPropertyOptional({ example: '07/08/2024', description: 'End date of the subscription' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'end_subscription_date must be in the format dd/mm/yyyy' })
  end_subscription_date?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether the subscription is canceled' })
  @IsOptional()
  @IsBoolean()
  canceled?: boolean;
}
