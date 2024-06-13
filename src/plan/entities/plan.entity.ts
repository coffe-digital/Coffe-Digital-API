import { Decimal } from "@prisma/client/runtime/library";

export class Plan {
    id?: number;
    name: string;
    description: string;
    status: boolean;
    price: number;
}
