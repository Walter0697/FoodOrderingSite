import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userService from '@/services/user'

import { User } from '@prisma/client'

export type JwtInfo = {
    id: number
    username: string
    rank: string
}

const PasswordSalt: number = 10

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(PasswordSalt)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

export const retrieveBearerToken = (authorization: string): string | null => {
    if (!authorization) {
        return null
    }
    const list = authorization.split(' ')
    if (list.length <= 1) {
        return null
    }

    const token = list[1]
    return token
}

export const generateToken = async (user: User): Promise<string> => {
    const jwtSecret: string = process.env.JWT_SECRET ?? 'secret'
    const jwtExpire: string = process.env.JWT_EXPIRE ?? '1d'
    const jwtInfo: JwtInfo = {
        id: user.id,
        username: user.username,
        rank: user.rank,
    }
    const token = jwt.sign(jwtInfo, jwtSecret, {
        expiresIn: jwtExpire,
    })
    return token
}

export const verifyToken = async (token: string): Promise<JwtInfo> => {
    const jwtSecret: string = process.env.JWT_SECRET ?? 'secret'
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                reject(err)
            }
            resolve(decoded as JwtInfo)
        })
    })
}

export const isAuthorized = async (
    token: string,
    isAdmin: boolean
): Promise<User | null> => {
    const jwtInfo = await verifyToken(token)
    const user = await userService.getUserById(jwtInfo.id)
    if (!user || !user.activated) {
        return null
    }
    if (isAdmin) {
        if (user.rank !== 'admin') {
            return null
        }
    }

    return user
}
