import type { NextApiRequest, NextApiResponse } from 'next'
import { MonthlyOrder } from '@prisma/client'

import monthlyOrderService from '@/services/monthlyOrder'
import orderingService from '@/services/ordering'

import { MonthlyOrderStatus } from '@/types/enum'
import { DatabaseErrorObj } from '@/types/common'

import { adminMiddleware } from '@/middlewares/admin'

import { calculateTotalPrice } from '@/utils/list'

type CompleteRequestBody = {
    selectedMonth: string
    status: string
    reason: string
    actualPrice: number
    expectedDeliveryDate: string
}

type CompleteResponseData =
    | {
          success: true
          data: MonthlyOrder
      }
    | {
          success: false
          message: string
      }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CompleteResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const user = await adminMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const body: CompleteRequestBody = JSON.parse(req.body)
            const orderList = await orderingService.getOrderingsByMonth(
                body.selectedMonth
            )
            const totalPrice = calculateTotalPrice(orderList)
            const result = await monthlyOrderService.completeMonthlyOrder(
                {
                    selectedMonth: body.selectedMonth,
                    expectedPrice: totalPrice,
                    actualPrice: body.actualPrice,
                    reason: body.reason,
                    expectedDeliveryDate: body.expectedDeliveryDate,
                },
                user.id
            )

            if (result.hasOwnProperty('message')) {
                const errorObj = result as DatabaseErrorObj
                return res.status(400).json({
                    success: false,
                    message: errorObj.message,
                })
            }

            return res.status(200).json({
                success: true,
                data: result as MonthlyOrder,
            })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
