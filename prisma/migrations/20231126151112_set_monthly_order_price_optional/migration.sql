-- AlterTable
ALTER TABLE "MonthlyOrder" ALTER COLUMN "expectedPrice" DROP NOT NULL,
ALTER COLUMN "actualPrice" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "notes" TEXT,
    "totalPrice" DECIMAL(9,2) NOT NULL,
    "targetUsers" INTEGER[],
    "status" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "deletedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillPaidRecord" (
    "id" SERIAL NOT NULL,
    "billId" INTEGER NOT NULL,
    "notes" TEXT,
    "Amount" DECIMAL(9,2) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "deletedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BillPaidRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPaidRecord" ADD CONSTRAINT "BillPaidRecord_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPaidRecord" ADD CONSTRAINT "BillPaidRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPaidRecord" ADD CONSTRAINT "BillPaidRecord_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPaidRecord" ADD CONSTRAINT "BillPaidRecord_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
