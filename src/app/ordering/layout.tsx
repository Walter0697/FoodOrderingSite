import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserSessionData } from '@/types/session'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { verifyToken } from '@/utils/auth'

import TopBar from '@/components/common/TopBar'

import userService from '@/services/user'
import { Box } from '@mui/material'

async function getUserSessionFromServer(): Promise<UserSessionData | null> {
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

    return {
        username: user.username,
        displayname: user.displayname,
        rank: user.rank,
        id: user.id,
    }
}

export default async function OrderingLayout({
    children,
}: {
    children: React.ReactElement
}) {
    const userSession = await getUserSessionFromServer()
    return (
        <>
            <Box>
                <TopBar userSession={userSession} />
            </Box>
            <Box
                sx={{
                    height: 'calc(100vh - 64px)',
                    backgroundColor: 'gray',
                    overflow: 'hidden',
                    width: '100vw',
                }}
            >
                {children}
            </Box>
        </>
    )
}
