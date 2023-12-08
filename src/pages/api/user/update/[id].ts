import type { NextApiRequest, NextApiResponse } from 'next'
import userService from '@/services/user'

import { adminMiddleware } from '@/middlewares/admin'

type EditUserRequestBody = {
    activated: boolean
    discordUsername: string
}

type ResponseData = {
    success?: boolean
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const requestMethod = req.method
    const id = Number(req.query.id)

    switch (requestMethod) {
        case 'PATCH': {
            const user = await adminMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const body: EditUserRequestBody = JSON.parse(req.body)
            const success = await userService.updateUserInformation(
                id,
                body.activated,
                body.discordUsername,
            )

            if (!success) {
                return res.status(401).json({
                    success: false,
                    message:
                        'edit user failed, please try again or contact adminitrator',
                })
            }

            return res.status(200).json({ success: true })
        }
        default: {
            res.setHeader('Allow', ['PATCH'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
