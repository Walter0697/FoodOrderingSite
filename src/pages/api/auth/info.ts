import type { NextApiRequest, NextApiResponse } from 'next'
import userService from '@/services/user'

import { ExtraInformationType } from '@/types/model'

import { userMiddleware } from '@/middlewares/user'
import { comparePassword } from '@/utils/auth'

type ChangeInfoRequestBody = {
    oldPassword: string
    newUsername: string
    newPassword: string
    newFavFood: string
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

    switch (requestMethod) {
        case 'POST': {
            const body: ChangeInfoRequestBody = JSON.parse(req.body)
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({ success: false })
            }

            const valid = await comparePassword(
                body.oldPassword,
                user?.password ?? ''
            )
            if (!valid) {
                return res
                    .status(401)
                    .json({ success: false, message: 'Invalid password' })
            }

            const extraInformation = JSON.parse(
                user.extraInformation ?? '{}'
            ) as ExtraInformationType

            const success = await userService.updateUser(
                user.id,
                extraInformation.birthday ?? '',
                body.newFavFood,
                body.newUsername,
                body.newPassword
            )

            if (!success) {
                return res
                    .status(500)
                    .json({ success: false, message: 'Internal server error' })
            }

            return res.status(200).json({ success: true })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
