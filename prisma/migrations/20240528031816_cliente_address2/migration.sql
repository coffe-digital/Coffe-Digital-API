/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_id_fkey";

-- AlterTable
CREATE SEQUENCE client_id_seq;
ALTER TABLE "Client" ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('client_id_seq');
ALTER SEQUENCE client_id_seq OWNED BY "Client"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
