import type { NextApiRequest, NextApiResponse } from 'next'

import monthlyOrderService from '@/services/monthlyOrder'

import { MonthlyOrderStatus } from '@/types/enum'
import { DatabaseErrorObj } from '@/types/common'

import { adminMiddleware } from '@/middlewares/admin'

type StatusRequestBody = {
    selectedMonth: string
    status: string
}

type StatusResponseData = {
    success: boolean
    data: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StatusResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'PATCH': {
            const user = await adminMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    data: 'invalid authentication',
                })
            }

            const body: StatusRequestBody = JSON.parse(req.body)
            if (
                !Object.values(MonthlyOrderStatus).includes(
                    body.status as MonthlyOrderStatus
                )
            ) {
                return res.status(400).json({
                    success: false,
                    data: 'invalid status',
                })
            }
            const updatedMO =
                await monthlyOrderService.setStatusForMonthlyOrder(
                    body.selectedMonth,
                    body.status as MonthlyOrderStatus
                )

            if (updatedMO.hasOwnProperty('message')) {
                const errorObj = updatedMO as DatabaseErrorObj
                return res.status(400).json({
                    success: false,
                    data: errorObj.message,
                })
            }

            return res.status(200).json({
                success: true,
                data: 'success',
            })
        }
        default: {
            res.setHeader('Allow', ['PATCH'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
