import type { NextApiRequest, NextApiResponse } from 'next'

import orderingService from '@/services/ordering'

import { userMiddleware } from '@/middlewares/user'

import { Ordering } from '@prisma/client'

type ListQuery = {
    selectedMonth: string
}

type ResponseData = {
    list: Partial<Ordering>[]
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
                return res.status(401).json({ list: [] })
            }

            const list = await orderingService.getOrderingsByMonth(
                params.selectedMonth
            )

            return res.status(200).json({ list })
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
