import { getPrisma } from '@/utils/prisma'
import { BillPaidRecord } from '@prisma/client'

const createOrUpdateBillRecord = async (
    billId: number,
    paidAmount: number,
    notes: string,
    userId: number
): Promise<BillPaidRecord> => {
    const billPaidRecord = await getPrisma().billPaidRecord.findFirst({
        where: {
            billId: billId,
            createdBy: userId,
            deletedAt: null,
        },
    })

    if (billPaidRecord) {
        const updatedBillPaidRecord = await getPrisma().billPaidRecord.update({
            where: {
                id: billPaidRecord.id,
            },
            data: {
                Amount: paidAmount,
                notes,
                updatedBy: userId,
            },
        })
        return updatedBillPaidRecord
    }

    const newBillPaidRecord = await getPrisma().billPaidRecord.create({
        data: {
            billId,
            Amount: paidAmount,
            notes,
            createdBy: userId,
            updatedBy: userId,
        },
    })

    return newBillPaidRecord
}

const getBillPaidRecordByBillId = async (
    billId: number
): Promise<BillPaidRecord[]> => {
    const billPaidRecords = await getPrisma().billPaidRecord.findMany({
        where: {
            billId,
            deletedAt: null,
        },
        include: {
            creator: {
                select: {
                    displayname: true,
                },
            },
        },
    })

    return billPaidRecords
}

const getBillPaidRecordByUserIdAndBillIdList = async (
    billIdList: number[],
    userId: number
): Promise<BillPaidRecord[]> => {
    if (billIdList.length === 0) return []
    const billPaidRecords = await getPrisma().billPaidRecord.findMany({
        where: {
            billId: {
                in: billIdList,
            },
            createdBy: userId,
            deletedAt: null,
        },
    })

    return billPaidRecords
}

const billPaidRecordService = {
    createOrUpdateBillRecord,
    getBillPaidRecordByBillId,
    getBillPaidRecordByUserIdAndBillIdList,
}

export default billPaidRecordService
