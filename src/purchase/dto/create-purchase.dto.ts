import { IsBoolean, IsString, IsNumber, Matches, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../enum/payment.enum';

export class CreatePurchaseDto {
  @ApiProperty({ example: 'Subscription', description: 'Type of purchase' })
  @IsString()
  type: string;

  @ApiProperty({ example: 1, description: 'ID of the client' })
  @IsNumber()
  client_id: number;

  @ApiProperty({ example: 2, description: 'ID of the product', required: false })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({ example: 3, description: 'ID of the plan', required: false })
  @IsOptional()
  @IsNumber()
  plan_id?: number;

  @ApiProperty({ example: 15, description: 'Payday of the subscription' })
  @IsNumber()
  payday: number;

  @ApiProperty({ example: 1, description: 'Payment method ID' })
  @IsEnum(Payment)
  payment_method: Payment;

  @ApiProperty({ example: true, description: 'Payment status' })
  @IsBoolean()
  payment_status: boolean;

  @ApiProperty({ example: '07/07/2024', description: 'Start date of the subscription' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'start_subscription_date must be in the format dd/mm/yyyy' })
  start_subscription_date: string;

  @ApiProperty({ example: '07/08/2024', description: 'End date of the subscription' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'end_subscription_date must be in the format dd/mm/yyyy' })
  end_subscription_date: string;

  @ApiProperty({ example: false, description: 'Whether the subscription is canceled' })
  @IsBoolean()
  canceled: boolean;
}
