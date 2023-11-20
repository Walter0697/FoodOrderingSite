import { NextResponse } from 'next/server'
import { User } from '@prisma/client'
import { getCookie } from 'cookies-next'

import { NextApiRequest } from 'next'
import userService from '@/services/user'

import { ServerConfiguration } from '@/utils/constant'
import { verifyToken } from '@/utils/auth'

export const userMiddleware = async (
    request: NextApiRequest
): Promise<User | null> => {
    const sessionKey = getCookie(ServerConfiguration.SessionKeyName, {
        req: request,
    })
    if (!sessionKey) {
        return null
    }
    const jwtInfo = await verifyToken(sessionKey)
    const user = await userService.getUserById(jwtInfo.id)
    if (!user || !user.activated) {
        return null
    }

    return user
}
