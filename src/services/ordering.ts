import { getPrisma } from '@/utils/prisma'
import { Ordering } from '@prisma/client'

import { DatabaseErrorObj } from '@/types/common'
import { ManageOrderingDto } from '@/types/dto/ordering'

const getOrderingsByMonth = async (
    monthIdentifier: string
): Promise<Ordering[]> => {
    const orderings = await getPrisma().ordering.findMany({
        where: {
            selectedMonth: monthIdentifier,
            deletedAt: null,
        },
    })
    return orderings
}

const getOrderByProductIdAndMonth = async (
    productId: number,
    monthIdentifier: string
): Promise<Ordering | null> => {
    const ordering = await getPrisma().ordering.findFirst({
        where: {
            productId: productId,
            selectedMonth: monthIdentifier,
        },
    })
    return ordering
}

const upsertOrdering = async (
    dto: ManageOrderingDto,
    userId: number
): Promise<Ordering | DatabaseErrorObj> => {
    const existingOrder = await getPrisma().ordering.findFirst({
        where: {
            selectedMonth: dto.selectedMonth,
            productId: dto.productId,
        },
    })

    if (existingOrder) {
        const updatedOrder = await getPrisma().ordering.update({
            where: {
                id: existingOrder.id,
            },
            data: {
                quantity: dto.quantity,
                price: dto.price,
                updatedBy: userId,
            },
        })
        return updatedOrder
    }

    const newOrder = await getPrisma().ordering.create({
        data: {
            quantity: dto.quantity,
            category: dto.category,
            price: dto.price,
            selectedMonth: dto.selectedMonth,
            productId: dto.productId,
            createdBy: userId,
            updatedBy: userId,
        },
    })

    return newOrder
}

const orderingService = {
    getOrderingsByMonth,
    getOrderByProductIdAndMonth,
    upsertOrdering,
}

export default orderingService
