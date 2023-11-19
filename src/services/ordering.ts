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
        },
    })
    return orderings
}

const upsertOrdering = async (
    dto: ManageOrderingDto,
    userId: number
): Promise<Ordering | DatabaseErrorObj> => {
    const product = await getPrisma().product.findUnique({
        where: {
            identifier: dto.productIdentifier,
        },
    })

    if (!product) {
        return {
            message: 'Product not found',
        }
    }

    const existingOrder = await getPrisma().ordering.findFirst({
        where: {
            selectedMonth: dto.selectedMonth,
            productId: product.id,
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
            productId: product.id,
            createdBy: userId,
            updatedBy: userId,
        },
    })

    return newOrder
}

const orderingService = {
    getOrderingsByMonth,
    upsertOrdering,
}

export default orderingService
