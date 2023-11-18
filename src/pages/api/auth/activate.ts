import type { NextApiRequest, NextApiResponse } from 'next'
import userService from '@/services/user'

type ActivateRequestBody = {
    username: string
    birthday: string
    favFood: string
    password: string
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
            const body: ActivateRequestBody = JSON.parse(req.body)
            const user = await userService.getUserByUsername(body.username)

            if (!user) {
                return res.status(401).json({ success: false })
            }

            if (user.password) {
                return res.status(401).json({
                    success: false,
                    message: 'this user is already activated',
                })
            }

            const success = await userService.activateUser(
                user.id,
                body.birthday,
                body.favFood,
                body.password
            )

            if (!success) {
                return res.status(401).json({
                    success: false,
                    message:
                        'activation failed, please try again or contact adminitrator',
                })
            }

            return res.status(200).json({ success: true })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
