import type { NextApiRequest, NextApiResponse } from 'next'

import orderingService from '@/services/ordering'

import { DatabaseErrorObj } from '@/types/common'

import { userMiddleware } from '@/middlewares/user'

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

            const orderId = Number(req.query.orderId)
            const existingOrder = await orderingService.editOrdering(
                {
                    orderId,
                    category: body.category,
                    quantity: body.quantity,
                },
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
