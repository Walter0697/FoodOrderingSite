import { getPrisma } from '@/utils/prisma'
import { Bill } from '@prisma/client'

import { BillStatus } from '@/types/enum'
import { ManageBillDto } from '@/types/dto/bill'

const getBillByUserId = async (userId: number): Promise<Bill[]> => {
    const bills = await getPrisma().bill.findMany({
        where: {
            createdBy: userId,
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

const billService = {
    getBillByUserId,
    getOwedPendingBillByUserId,
    createBill,
}

export default billService
