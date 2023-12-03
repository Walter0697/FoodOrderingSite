import { NextApiRequest, NextApiResponse } from 'next'

import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'
import { userMiddleware } from '@/middlewares/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'GET': {
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const owedPendingBills =
                await billService.getOwedPendingBillByUserId(user.id)
            const myBills = await billService.getBillsByUserId(user.id)

            const billIdList = owedPendingBills.map((bill) => bill.id)
            const paidRecords =
                await billPaidRecordService.getBillPaidRecordByBillIdList(
                    billIdList
                )
            const unpaidRecord = new Set<number>()
            for (let i = 0; i < owedPendingBills.length; i++) {
                const bill = owedPendingBills[i]
                const myPaidRecord = paidRecords.find(
                    (record) => record.billId === bill.id
                )
                if (!myPaidRecord) {
                    unpaidRecord.add(bill.id)
                }
            }

            const myBillIdList = myBills.map((bill) => bill.id)
            const myPaidRecords =
                await billPaidRecordService.getBillPaidRecordByBillIdList(
                    myBillIdList
                )

            const completedMyBill = new Set<number>()
            const unCompleteMyBill = new Set<number>()
            for (let i = 0; i < myBills.length; i++) {
                const currentItem = myBills[i]
                const records = myPaidRecords.filter(
                    (record) => record.billId === myBills[i].id
                )
                if (records.length === currentItem.targetUsers.length) {
                    completedMyBill.add(currentItem.id)
                } else {
                    unCompleteMyBill.add(currentItem.id)
                }
            }

            res.status(200).json({
                success: true,
                data: {
                    unpaidNumber: unpaidRecord.size,
                    completedNumber: completedMyBill.size,
                    unCompleteNumber: unCompleteMyBill.size,
                },
            })
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
