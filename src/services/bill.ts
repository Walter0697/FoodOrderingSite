import { getPrisma } from '@/utils/prisma'
import { Bill } from '@prisma/client'

import { BillStatus } from '@/types/enum'
import { ManageBillDto } from '@/types/dto/bill'

const getBillById = async (billId: number): Promise<Bill | null> => {
    const bill = await getPrisma().bill.findUnique({
        where: {
            id: billId,
        },
    })

    return bill
}

const getBillsByUserId = async (userId: number): Promise<Bill[]> => {
    const bills = await getPrisma().bill.findMany({
        where: {
            createdBy: userId,
            status: BillStatus.Pending,
        },
        orderBy: [
            {
                status: 'asc',
            },
            {
                createdAt: 'desc',
            },
        ],
    })

    return bills
}

const getOwedPendingBillByUserId = async (userId: number): Promise<Bill[]> => {
    const bills = await getPrisma().bill.findMany({
        where: {
            status: BillStatus.Pending,
            targetUsers: {
                has: userId,
            },
        },
        include: {
            creator: {
                select: {
                    displayname: true,
                },
            },
        },
    })

    return bills
}

const createBill = async (
    dto: ManageBillDto,
    userId: number
): Promise<Bill> => {
    const bill = await getPrisma().bill.create({
        data: {
            restaurantName: dto.restaurant,
            photoUrl: dto.photoUrl,
            notes: dto.notes,
            totalPrice: dto.totalPrice,
            targetUsers: dto.targetUsers,
            status: BillStatus.Pending,
            createdBy: userId,
            updatedBy: userId,
        },
    })

    return bill
}

const completeBill = async (billId: number, userId: number): Promise<Bill> => {
    const bill = await getPrisma().bill.update({
        where: {
            id: billId,
        },
        data: {
            status: BillStatus.Completed,
            updatedBy: userId,
        },
    })

    return bill
}

const billService = {
    getBillById,
    getBillsByUserId,
    getOwedPendingBillByUserId,
    createBill,
    completeBill,
}

export default billService
