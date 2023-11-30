import type { NextApiRequest, NextApiResponse } from 'next'

import orderingService from '@/services/ordering'
import monthlyOrderService from '@/services/monthlyOrder'

import { DatabaseErrorObj } from '@/types/common'
import { MonthlyOrderStatus } from '@/types/enum'
import { Ordering } from '@prisma/client'

import { userMiddleware } from '@/middlewares/user'

import { ConstantValue } from '@/utils/constant'

type EditOrderingRequestBody = {
    category: string
    quantity: number
}

type ResponseData = {
    success?: boolean
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'PATCH': {
            const body: EditOrderingRequestBody = JSON.parse(req.body)
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({ success: false })
            }

            if (
                body.quantity < 0 ||
                body.quantity > ConstantValue.MaximumProductNumber
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid quantity',
                })
            }

            const orderId = Number(req.query.orderId)
            const existingOrder = await orderingService.getOrderingById(orderId)

            if (!existingOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'Ordering not found',
                })
            }

            const currentExistingOrder = existingOrder as Ordering
            const monthlyOrder =
                await monthlyOrderService.getOrCreateMonthlyOrder(
                    currentExistingOrder.selectedMonth,
                    user.id
                )

            if (monthlyOrder.status !== MonthlyOrderStatus.Pending) {
                return res.status(400).json({
                    success: false,
                    message: 'Order for this month is locked',
                })
            }

            const updatedOrder = await orderingService.editOrdering(
                {
                    orderId,
                    category: body.category,
                    quantity: body.quantity,
                },
                user.id
            )

            if ((updatedOrder as DatabaseErrorObj).message) {
                return res.status(400).json({
                    success: false,
                    message: (updatedOrder as DatabaseErrorObj).message,
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Order updated successfully',
            })
        }
        case 'DELETE': {
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({ success: false })
            }

            const orderId = Number(req.query.orderId)
            const existingOrder = await orderingService.removeOrdering(
                orderId,
                user.id
            )

            if ((existingOrder as DatabaseErrorObj).message) {
                return res.status(400).json({
                    success: false,
                    message: (existingOrder as DatabaseErrorObj).message,
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Order deleted successfully',
            })
        }
        default: {
            res.setHeader('Allow', ['PATCH', 'DELETE'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
