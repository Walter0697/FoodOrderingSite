import type { NextApiRequest, NextApiResponse } from 'next'

import productService from '@/services/product'
import orderingService from '@/services/ordering'

import { DatabaseErrorObj } from '@/types/common'

import { userMiddleware } from '@/middlewares/user'

type AddToCartRequestBody = {
    productId: number
    quantity: number
    price: number
    overrideQuantity: boolean
    category: string
    selectedMonth: string
}

type ResponseData = {
    success?: boolean
    message?: string
    showConfirm?: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const body: AddToCartRequestBody = JSON.parse(req.body)
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({ success: false })
            }

            const product = await productService.getProductById(body.productId)
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not found',
                })
            }

            const existingOrder =
                await orderingService.getOrderByProductIdAndMonth(
                    body.productId,
                    body.selectedMonth
                )

            if (existingOrder && !body.overrideQuantity) {
                return res.status(200).json({
                    success: false,
                    showConfirm: true,
                    message:
                        'Product already exists in the cart, do you want to override ',
                })
            }

            const upsertedOrder = await orderingService.upsertOrdering(
                {
                    productId: body.productId,
                    quantity: body.quantity,
                    price: body.price,
                    selectedMonth: body.selectedMonth,
                    category: body.category,
                },
                user.id
            )

            if (upsertedOrder.hasOwnProperty('message')) {
                const error = upsertedOrder as DatabaseErrorObj
                return res.status(500).json({
                    success: false,
                    message: error.message,
                })
            }

            // TODO: send to socket here

            return res.status(200).json({
                success: true,
                message: 'Successfully added to cart',
            })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
