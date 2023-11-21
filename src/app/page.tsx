import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserSessionData } from '@/types/session'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { verifyToken } from '@/utils/auth'

import TopBar from '@/components/common/TopBar'

import userService from '@/services/user'

async function checkUserSession() {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
        return null
    }

    const jwtInfo = await verifyToken(token.value)
    const user = await userService.getUserById(jwtInfo.id)

    if (!user) {
        redirect(StaticPath.HomePage)
        return null
    }

    if (!user.activated) {
        redirect(StaticPath.HomePage)
        return null
    }

    redirect(StaticPath.LoginedHomePage)
}

const Index = async () => {
    await checkUserSession()
    return false
}
export default Index
