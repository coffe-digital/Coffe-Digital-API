-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "payday" INTEGER NOT NULL,
    "payment_method" INTEGER NOT NULL,
    "payment_status" BOOLEAN NOT NULL,
    "start_subscription_date" INTEGER NOT NULL,
    "end_subscription_date" INTEGER NOT NULL,
    "canceled" BOOLEAN NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
