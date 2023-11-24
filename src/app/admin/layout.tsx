import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserSessionData } from '@/types/session'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

import TopBar from '@/components/common/TopBar'

import { Box } from '@mui/material'
import { ExtraInformationType } from '@/types/model'

async function getUserSessionFromServer(): Promise<UserSessionData | null> {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, true)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    let favFood: string = ''
    try {
        if (user.extraInformation) {
            const extraInfo: ExtraInformationType = JSON.parse(
                user.extraInformation
            )
            favFood = extraInfo.favFood ?? ''
        }
    } catch (err) {
        favFood = ''
    }

    return {
        username: user.username,
        displayname: user.displayname,
        rank: user.rank,
        favFood: favFood,
        id: user.id,
    }
}

export default async function AdminLayout({
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
