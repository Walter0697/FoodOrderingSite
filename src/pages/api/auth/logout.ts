import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'
import { ServerConfiguration } from '@/utils/constant'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            setCookie(ServerConfiguration.SessionKeyName, null, {
                req,
                res,
            })

            return res.status(200).json({ success: true })
        }
        default: {
            return res.status(405).json({ success: false })
        }
    }
}
