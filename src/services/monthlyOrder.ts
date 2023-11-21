import { getPrisma } from '@/utils/prisma'
import { MonthlyOrder } from '@prisma/client'

import { DatabaseErrorObj } from '@/types/common'
import { MonthlyOrderStatus } from '@/types/enum'
import { CompleteMonthlyOrderDto } from '@/types/dto/monthlyOrder'

const getOrCreateMonthlyOrder = async (
    selectedMonth: string,
    userId: number
) => {
    const monthlyOrder = await getPrisma().monthlyOrder.findFirst({
        where: {
            selectedMonth: selectedMonth,
            deletedAt: null,
        },
    })

    if (!monthlyOrder) {
        const newMonthlyOrder = await getPrisma().monthlyOrder.create({
            data: {
                selectedMonth: selectedMonth,
                createdBy: userId,
                updatedBy: userId,
                status: MonthlyOrderStatus.Pending,
            },
        })
        return newMonthlyOrder
    }

    return monthlyOrder
}

const setStatusForMonthlyOrder = async (
    selectedMonth: string,
    status: MonthlyOrderStatus
): Promise<MonthlyOrder | DatabaseErrorObj> => {
    const existingMonthlyOrder = await getPrisma().monthlyOrder.findFirst({
        where: {
            selectedMonth: selectedMonth,
            deletedAt: null,
        },
    })

    if (!existingMonthlyOrder) {
        return {
            message: 'Monthly order not found',
        }
    }

    const monthlyOrder = await getPrisma().monthlyOrder.update({
        where: {
            id: existingMonthlyOrder.id,
        },
        data: {
            status: status,
        },
    })
    return monthlyOrder
}

const completeMonthlyOrder = async (
    dto: CompleteMonthlyOrderDto,
    userId: number
): Promise<MonthlyOrder | DatabaseErrorObj> => {
    const existingMonthlyOrder = await getPrisma().monthlyOrder.findFirst({
        where: {
            selectedMonth: dto.selectedMonth,
            deletedAt: null,
        },
    })

    if (!existingMonthlyOrder) {
        return {
            message: 'Monthly order not found',
        }
    }

    const updatedMonthlyOrder = await getPrisma().monthlyOrder.update({
        where: {
            id: existingMonthlyOrder.id,
        },
        data: {
            status: MonthlyOrderStatus.Completed,
            expectedPrice: dto.expectedPrice,
            actualPrice: dto.actualPrice,
            reason: dto.reason,
            expectedDeliveryDate: dto.expectedDeliveryDate,
            updatedBy: userId,
        },
    })

    return updatedMonthlyOrder
}

const monthlyOrderService = {
    getOrCreateMonthlyOrder,
    setStatusForMonthlyOrder,
    completeMonthlyOrder,
}

export default monthlyOrderService
