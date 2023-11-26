import type { NextApiRequest, NextApiResponse } from 'next'

import { DetailedMonthlyOrder } from '@/types/model'

import orderingService from '@/services/ordering'
import monthlyOrderService from '@/services/monthlyOrder'

import { userMiddleware } from '@/middlewares/user'

import { MonthlyOrder, Ordering } from '@prisma/client'

type ListQuery = {
    selectedMonth: string
}

type ResponseData = {
    list: Partial<Ordering>[]
    orderStatus: MonthlyOrder | null
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'GET': {
            const params = req.query as ListQuery
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({ list: [], orderStatus: null })
            }

            const list = await orderingService.getOrderingsByMonth(
                params.selectedMonth
            )
            const monthlyOrder =
                await monthlyOrderService.getOrCreateMonthlyOrder(
                    params.selectedMonth,
                    user.id
                )

            const parsedList = list.map((item) => {
                return {
                    ...item,
                    priceFloat: item.price ? item.price.toNumber() : 0,
                }
            })
            const parsedMonthly: DetailedMonthlyOrder = {
                ...monthlyOrder,
                expectedPriceFloat: monthlyOrder.expectedPrice
                    ? monthlyOrder.expectedPrice.toNumber()
                    : 0,
                actualPriceFloat: monthlyOrder.actualPrice
                    ? monthlyOrder.actualPrice.toNumber()
                    : 0,
            }

            return res
                .status(200)
                .json({ list: parsedList, orderStatus: parsedMonthly })
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
