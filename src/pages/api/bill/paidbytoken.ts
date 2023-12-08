import { NextApiRequest, NextApiResponse } from 'next'

import { BillStatus } from '@/types/enum'

import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'
import userService from '@/services/user'

import { extractBillSecret } from '@/utils/auth'

type BillPaidByTokenRequestBody = {
    token: string
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
            const body: BillPaidByTokenRequestBody = JSON.parse(req.body)

            const billSecret = await extractBillSecret(body.token)
            if (!billSecret) {
                return res.status(400).json({
                    success: false,
                    message: 'invalid token',
                })
            }

            const bill = await billService.getBillById(billSecret.billId)
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

            const user = await userService.getUserById(billSecret.userId)
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'user not found',
                })
            }

            const result = await billPaidRecordService.createOrUpdateBillRecord(
                billSecret.billId,
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
