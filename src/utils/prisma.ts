import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient = new PrismaClient()

export const getPrisma = () => {
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient()
    } else {
        if (!prisma) {
            prisma = new PrismaClient()
        }
    }

    return prisma
}
