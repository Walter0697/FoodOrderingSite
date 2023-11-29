import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { UserSessionData } from '@/types/session'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { verifyToken } from '@/utils/auth'

import TopBar from '@/components/common/TopBar'

import userService from '@/services/user'

async function checkUserSession() {
    redirect(StaticPath.HomePage)
}

const Index = async () => {
    await checkUserSession()
    return false
}
export default Index
