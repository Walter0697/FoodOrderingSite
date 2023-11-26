/*
  Warnings:

  - You are about to alter the column `expectedPrice` on the `MonthlyOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `actualPrice` on the `MonthlyOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - You are about to alter the column `price` on the `Ordering` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,2)`.
  - Made the column `expectedPrice` on table `MonthlyOrder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actualPrice` on table `MonthlyOrder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MonthlyOrder" ALTER COLUMN "expectedPrice" SET NOT NULL,
ALTER COLUMN "expectedPrice" SET DATA TYPE DECIMAL(9,2),
ALTER COLUMN "actualPrice" SET NOT NULL,
ALTER COLUMN "actualPrice" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "Ordering" ALTER COLUMN "price" SET DATA TYPE DECIMAL(9,2);
