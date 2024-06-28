import { IsString } from "class-validator";
import { AboutUs } from "../entities/about_us.entity";

export class CreateAboutUsDto extends AboutUs{
    @IsString()
    description: string;
}
