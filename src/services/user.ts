import { getPrisma } from '@/utils/prisma'
import { User } from '@prisma/client'
import { hashPassword } from '@/utils/auth'

const getUserByUsername = async (username: string): Promise<User | null> => {
    const user = await getPrisma().user.findUnique({
        where: {
            username: username,
        },
    })
    return user
}

const getUserById = async (id: number): Promise<User | null> => {
    const user = await getPrisma().user.findUnique({
        where: {
            id: id,
        },
    })
    return user
}

const activateUser = async (
    id: number,
    birthday: string,
    favFood: string,
    password: string
): Promise<boolean> => {
    const extraInformation: string = JSON.stringify({
        birthday: birthday,
        favFood: favFood,
    })
    const hashedPassword = await hashPassword(password)
    const user = await getPrisma().user.update({
        where: {
            id: id,
        },
        data: {
            extraInformation: extraInformation,
            password: hashedPassword,
        },
    })
    return !!user
}

const userService = {
    getUserByUsername,
    getUserById,
    activateUser,
}

export default userService
