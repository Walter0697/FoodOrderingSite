import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Box, Grid } from '@mui/material'

import userService from '@/services/user'
import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'

import { DetailedBill } from '@/types/model'
import { SelectOptions } from '@/types/common'

import BillTitle from '@/components/bill/BillTitle'
import BillOwedTable from '@/components/bill/BillOwedTable'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

type MyBillProps = {
    list: DetailedBill[]
    userId: number
    userList: SelectOptions[]
}

const getMyBills = async (): Promise<MyBillProps> => {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, false)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    const bills = await billService.getBillsByUserId(user.id)
    const billIdList = bills.map((bill) => bill.id)
    const paidRecords =
        await billPaidRecordService.getBillPaidRecordByBillIdList(billIdList)

    const details: DetailedBill[] = bills.map((bill) => {
        const currentItem: DetailedBill = bill as unknown as DetailedBill
        currentItem.totalPrice = bill.totalPrice.toNumber()
        const records = paidRecords.filter(
            (record) => record.billId === bill.id
        )

        currentItem.paidAmount = records.reduce(
            (previous, current) => previous + current.Amount.toNumber(),
            0
        )
        currentItem.paidPeopleNumber = `${records.length} / ${bill.targetUsers.length}`
        currentItem.paidRatio = records.length / bill.targetUsers.length

        return currentItem
    })

    const users = await userService.getAllUsers()
    const options: SelectOptions[] = users
        .map((user) => {
            const output: SelectOptions = {
                value: user.id,
                label: user.displayname,
            }
            return output
        })
        .filter((s) => s.value !== user.id) // removing myself

    return {
        list: details,
        userId: user.id,
        userList: options,
    }
}

export default async function MyBillList() {
    const serverProps = await getMyBills()

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <BillTitle ownedBill={false} />
                </Grid>
                <Grid item xs={12}>
                    <BillOwedTable
                        billList={serverProps.list}
                        userId={serverProps.userId}
                        userList={serverProps.userList}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
