import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { DetailedMonthlyOrder } from '@/types/model'

import HistoryList from '@/components/admin/HistoryList'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'
import { convertMonthlyOrderingToListItem_List } from '@/utils/display'

import monthlyOrderService from '@/services/monthlyOrder'

async function getHistory(): Promise<DetailedMonthlyOrder[]> {
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
    const detailed: DetailedMonthlyOrder[] = monthly.map((monthlyOrder) => {
        const currentItem = monthlyOrder as DetailedMonthlyOrder
        currentItem.expectedPriceFloat = monthlyOrder.expectedPrice
            ? monthlyOrder.expectedPrice.toNumber()
            : 0
        currentItem.actualPriceFloat = monthlyOrder.actualPrice
            ? monthlyOrder.actualPrice.toNumber()
            : 0
        return currentItem
    })
    return detailed
}

export default async function HistoryPage() {
    const monthlyOrders = await getHistory()
    const monthlyOrderList =
        convertMonthlyOrderingToListItem_List(monthlyOrders)

    return <HistoryList itemList={monthlyOrderList} />
}
