import { NextApiRequest, NextApiResponse } from 'next'
import billPaidRecordService from '@/services/billPaidRecord'
import { DetailedBillPaidRecord } from '@/types/model'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'GET': {
            const { billId } = req.query

            const billPaidRecords =
                await billPaidRecordService.getBillPaidRecordByBillId(
                    Number(billId)
                )

            const detailed: DetailedBillPaidRecord[] = billPaidRecords.map(
                (billPaidRecord) => {
                    const paidRecord =
                        billPaidRecord as unknown as DetailedBillPaidRecord
                    paidRecord.Amount = billPaidRecord.Amount.toNumber()
                    return paidRecord
                }
            )

            res.status(200).json({ records: detailed })
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
