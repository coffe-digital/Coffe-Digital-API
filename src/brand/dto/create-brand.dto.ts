import { IsString } from 'class-validator'
import { Brand } from "../entities/brand.entity";

export class CreateBrandDto extends Brand{
    @IsString()
    name: string;
}
