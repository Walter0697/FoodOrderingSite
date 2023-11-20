import { getPrisma } from '@/utils/prisma'
import { Ordering } from '@prisma/client'

import { DatabaseErrorObj } from '@/types/common'
import { EditOrderingDto, ManageOrderingDto } from '@/types/dto/ordering'

const getOrderingsByMonth = async (
    monthIdentifier: string
): Promise<Partial<Ordering>[]> => {
    const orderings = await getPrisma().ordering.findMany({
        where: {
            selectedMonth: monthIdentifier,
            deletedAt: null,
        },
        include: {
            product: true,
            creator: {
                select: {
                    displayname: true,
                },
            },
            updater: {
                select: {
                    displayname: true,
                },
            },
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
            deletedAt: null,
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
            deletedAt: null,
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

const editOrdering = async (
    dto: EditOrderingDto,
    userId: number
): Promise<Ordering | DatabaseErrorObj> => {
    const existingOrder = await getPrisma().ordering.findFirst({
        where: {
            id: dto.orderId,
            deletedAt: null,
        },
    })

    if (!existingOrder) {
        return {
            message: 'Ordering not found',
        }
    }

    const updatedOrder = await getPrisma().ordering.update({
        where: {
            id: dto.orderId,
        },
        data: {
            quantity: dto.quantity,
            category: dto.category,
            updatedBy: userId,
        },
    })

    return updatedOrder
}

const removeOrdering = async (
    orderId: number,
    userId: number
): Promise<Ordering | DatabaseErrorObj> => {
    const existingOrder = await getPrisma().ordering.findFirst({
        where: {
            id: orderId,
            deletedAt: null,
        },
    })

    if (!existingOrder) {
        return {
            message: 'Ordering not found',
        }
    }

    const deletingOrder = await getPrisma().ordering.update({
        where: {
            id: orderId,
        },
        data: {
            deletedAt: new Date(),
            deletedBy: userId,
        },
    })

    return deletingOrder
}

const orderingService = {
    getOrderingsByMonth,
    getOrderByProductIdAndMonth,
    upsertOrdering,
    editOrdering,
    removeOrdering,
}

export default orderingService
