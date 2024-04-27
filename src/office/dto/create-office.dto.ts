import { IsString } from "class-validator";
import { Office } from "../entities/office.entity";

export class CreateOfficeDto extends Office{
    @IsString()
    name: string;
}