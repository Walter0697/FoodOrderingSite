import { NextApiRequest, NextApiResponse } from 'next'

import { BillStatus } from '@/types/enum'

import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'
import paidService from '@/services/paid'
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

            const bill = await billService.getBillById(body.billId)
            if (bill === null) {
                return res.status(404).json({
                    success: false,
                    message: 'bill not found',
                })
            }

            if (bill.status !== BillStatus.Pending) {
                return res.status(400).json({
                    success: false,
                    message: 'bill is not pending',
                })
            }

            const result = await billPaidRecordService.createOrUpdateBillRecord(
                body.billId,
                body.paidAmount,
                body.notes,
                user.id
            )

            paidService.checkBillPaidRecordComplete(body.billId)

            res.status(200).json({ success: true, data: result })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
