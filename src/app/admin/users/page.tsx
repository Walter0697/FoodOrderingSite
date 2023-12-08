import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserListItem } from '@/types/display/user'
import { ExtraInformationType } from '@/types/model'

import UserList from '@/components/admin/UserList'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

import userService from '@/services/user'

async function getUserList(): Promise<UserListItem[]> {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, true)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    const users = await userService.getAllUsers()

    const userItems: UserListItem[] = users.map((user) => {
        let favFood: string = ''
        let birthday: string = ''
        try {
            if (user.extraInformation) {
                const extraInfo: ExtraInformationType = JSON.parse(
                    user.extraInformation
                )
                favFood = extraInfo.favFood ?? ''
                birthday = extraInfo.birthday ?? ''
            }
        } catch (err) {
            favFood = ''
            birthday = ''
        }
        const output: UserListItem = {
            id: user.id,
            username: user.username,
            displayname: user.displayname,
            rank: user.rank,
            activated: user.activated,
            favFood: favFood,
            birthday: birthday,
            signed: user.password ? true : false,
            discordUsername: user.discordUsername ?? '',
        }
        return output
    })

    return userItems
}

export default async function UserListPage() {
    const userList = await getUserList()

    return <UserList itemList={userList} />
}
