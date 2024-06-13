import { User } from "src/user/entities/user.entity";

export class Client extends User{
    id: number;
    userId: number;
    phone: string;
    birth_date: string;
    rg: string;
  }