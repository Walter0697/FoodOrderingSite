import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Box, Grid } from '@mui/material'

import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'

import { DetailedBill } from '@/types/model'

import BillTitle from '@/components/bill/BillTitle'
import OwedBillTable from '@/components/bill/OwedBillTable'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

import dayjs from 'dayjs'

type BillOwedProps = {
    list: DetailedBill[]
    userId: number
}

const getBillOwed = async (): Promise<BillOwedProps> => {
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
    const billIdList = bills.map((bill) => bill.id)
    const paidRecords =
        await billPaidRecordService.getBillPaidRecordByUserIdAndBillIdList(
            billIdList,
            user.id
        )
    const detailed: DetailedBill[] = bills.map((bill) => {
        const currentItem: DetailedBill = bill as unknown as DetailedBill
        currentItem.totalPrice = bill.totalPrice.toNumber()
        const paidRecord = paidRecords.find(
            (record) => record.billId === bill.id
        )
        if (paidRecord) {
            currentItem.paidAmount = paidRecord.Amount.toNumber()
            currentItem.paidTime = dayjs(paidRecord.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
            )
        } else {
            currentItem.paidAmount = null
            currentItem.paidTime = null
        }
        return currentItem
    })

    return {
        list: detailed,
        userId: user.id,
    }
}

export default async function BillList() {
    const serverProps = await getBillOwed()

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <BillTitle />
                </Grid>
                <Grid item xs={12}>
                    <OwedBillTable
                        billList={serverProps.list}
                        userId={serverProps.userId}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
