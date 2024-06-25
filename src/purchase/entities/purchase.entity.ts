export class Purchase {
    id?: number;
    type: string;
    client_id: number;
    product_id: number;
    plan_id: number;
    payday: number;
    payment_method: number;
    payment_status: boolean;
    start_subscription_date: number;
    end_subscription_date: number;
    canceled: boolean;
}
