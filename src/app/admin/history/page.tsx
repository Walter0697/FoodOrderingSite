import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { MonthlyOrder } from '@prisma/client'

import HistoryList from '@/components/admin/HistoryList'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'
import { convertMonthlyOrderingToListItem_List } from '@/utils/display'

import monthlyOrderService from '@/services/monthlyOrder'

async function getHistory(): Promise<MonthlyOrder[]> {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, true)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    const monthly = await monthlyOrderService.getAllMonthlyOrders()
    return monthly
}

export default async function HistoryPage() {
    const monthlyOrders = await getHistory()
    const monthlyOrderList =
        convertMonthlyOrderingToListItem_List(monthlyOrders)

    return <HistoryList itemList={monthlyOrderList} />
}
