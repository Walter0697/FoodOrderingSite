import type { NextApiRequest, NextApiResponse } from 'next'

import orderingService from '@/services/ordering'

import { userMiddleware } from '@/middlewares/user'

import { MonthlyOrder, Ordering } from '@prisma/client'
import monthlyOrderService from '@/services/monthlyOrder'

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

            return res.status(200).json({ list, orderStatus: monthlyOrder })
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
