import { getPrisma } from '@/utils/prisma'
import { User } from '@prisma/client'
import { hashPassword } from '@/utils/auth'

const getAllUsers = async (): Promise<User[]> => {
    const users = await getPrisma().user.findMany()
    return users
}

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

const getUserByIdList = async (idList: number[]): Promise<User[]> => {
    const users = await getPrisma().user.findMany({
        where: {
            id: {
                in: idList,
            },
        },
    })
    return users
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

const updateUser = async (
    id: number,
    birthday: string,
    favFood: string,
    username: string,
    password: string
): Promise<boolean> => {
    const extraInformation: string = JSON.stringify({
        birthday: birthday,
        favFood: favFood,
    })

    const updatingData: Partial<User> = {
        extraInformation: extraInformation,
        username: username,
    }

    if (password) {
        const hashedPassword = await hashPassword(password)
        updatingData.password = hashedPassword
    }
    const user = await getPrisma().user.update({
        where: {
            id: id,
        },
        data: updatingData,
    })
    return !!user
}

const updateUserInformation = async (
    id: number,
    activated: boolean,
    discordUsername: string
): Promise<boolean> => {
    const user = await getPrisma().user.update({
        where: {
            id: id,
        },
        data: {
            activated: activated,
            discordUsername: discordUsername,
        },
    })
    return !!user
}

const userService = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    getUserByIdList,
    activateUser,
    updateUser,
    updateUserInformation,
}

export default userService
