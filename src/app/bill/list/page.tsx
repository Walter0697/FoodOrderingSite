import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Box, Grid } from '@mui/material'

import billService from '@/services/bill'

import { DetailedBill } from '@/types/model'

import BillTitle from '@/components/bill/BillTitle'
import OwedBillTable from '@/components/bill/OwedBillTable'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

const getBillOwed = async (): Promise<DetailedBill[]> => {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, false)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    const bills = await billService.getOwedPendingBillByUserId(user.id)
    const detailed: DetailedBill[] = bills.map((bill) => {
        const currentItem = bill as DetailedBill
        currentItem.totalPriceFloat = bill.totalPrice
            ? bill.totalPrice.toNumber()
            : 0
        currentItem.paidAmount = null
        currentItem.paidTime = null
        return currentItem
    })
    return detailed
}

export default async function BillList() {
    const ownedBills = await getBillOwed()

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <BillTitle />
                </Grid>
                <Grid item xs={12}>
                    <OwedBillTable billList={ownedBills} />
                </Grid>
            </Grid>
        </Box>
    )
}
