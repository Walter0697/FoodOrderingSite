import { NextApiRequest, NextApiResponse } from 'next'
import billService from '@/services/bill'
import { userMiddleware } from '@/middlewares/user'

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

            const { billId } = req.query

            const billIdNumber = Number(billId)

            const bill = await billService.getBillById(billIdNumber)
            if (bill === null) {
                return res.status(404).json({
                    success: false,
                    message: 'bill not found',
                })
            }

            if (bill.createdBy !== user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'not bill creator',
                })
            }

            const result = await billService.completeBill(billIdNumber, user.id)

            res.status(200).json({ success: true, data: result })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
