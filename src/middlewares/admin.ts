import { User } from '@prisma/client'

import { NextApiRequest } from 'next'

import { userMiddleware } from './user'

export const adminMiddleware = async (
    request: NextApiRequest
): Promise<User | null> => {
    const user = await userMiddleware(request)

    if (!user) {
        return null
    }

    if (user.rank !== 'admin') {
        return null
    }

    return user
}
