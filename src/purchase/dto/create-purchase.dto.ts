import { IsBoolean, IsString, IsNumber, Matches, IsOptional, IsDate, IsDateString } from 'class-validator'
import { Purchase } from '../entities/purchase.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDto extends Purchase{
  @ApiProperty({ example: 'Subscription', description: 'Type of purchase' })
  @IsString()
  type: string;

  @ApiProperty({ example: 1, description: 'ID of the client' })
  @IsNumber()
  client_id: number;

  @ApiProperty({ example: 2, description: 'ID of the product', required: false })
  @IsOptional()
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 3, description: 'ID of the plan', required: false })
  @IsOptional()
  @IsNumber()
  plan_id: number;

  @ApiProperty({ example: 15, description: 'Payday of the subscription' })
  @IsNumber()
  payday: number;

  @ApiProperty({ example: 1, description: 'Payment method ID' })
  @IsNumber()
  payment_method: number;

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
