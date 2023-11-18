import type { NextApiRequest, NextApiResponse } from 'next'
import userService from '@/services/user'
import { comparePassword, generateToken } from '@/utils/auth'
import { ServerConfiguration } from '@/utils/constant'
import { setCookie } from 'cookies-next'

type LoginRequestBody = {
    username: string
    password: string
}

type ResponseData = {
    valid?: boolean
    firstLogin?: boolean
    token?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const body: LoginRequestBody = JSON.parse(req.body)
            const user = await userService.getUserByUsername(body.username)

            if (!user) {
                return res.status(401).json({ valid: false })
            }

            if (!user.password) {
                if (body.username === body.password) {
                    return res.status(201).json({
                        valid: true,
                        firstLogin: true,
                    })
                } else {
                    return res.status(401).json({ valid: false })
                }
            }

            const valid = await comparePassword(body.password, user.password)

            if (!valid) {
                return res.status(401).json({ valid: false })
            }

            const token = await generateToken(user)

            setCookie(ServerConfiguration.SessionKeyName, token, {
                req,
                res,
                maxAge: 60 * 6 * 24,
            })

            return res
                .status(200)
                .json({ valid: true, token: token, firstLogin: false })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
