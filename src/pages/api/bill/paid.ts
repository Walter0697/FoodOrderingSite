import { NextApiRequest, NextApiResponse } from 'next'

import billPaidRecordService from '@/services/billPaidRecord'
import { userMiddleware } from '@/middlewares/user'

type CreateBillPaidRecordRequestBody = {
    billId: number
    paidAmount: number
    notes: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const body: CreateBillPaidRecordRequestBody = JSON.parse(req.body)
            const result = await billPaidRecordService.createOrUpdateBillRecord(
                body.billId,
                body.paidAmount,
                body.notes,
                user.id
            )

            res.status(200).json({ success: true, data: result })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
