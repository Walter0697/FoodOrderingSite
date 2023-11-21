-- CreateTable
CREATE TABLE "MonthlyOrder" (
    "id" SERIAL NOT NULL,
    "selectedMonth" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "expectedPrice" DOUBLE PRECISION,
    "actualPrice" DOUBLE PRECISION,
    "reason" TEXT,
    "expectedDeliveryDate" TEXT,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "deletedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MonthlyOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonthlyOrder" ADD CONSTRAINT "MonthlyOrder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyOrder" ADD CONSTRAINT "MonthlyOrder_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyOrder" ADD CONSTRAINT "MonthlyOrder_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
