'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import DashboardTitle from '@/components/dashboard/DashboardTitle'
import DashboardActionList from '@/components/dashboard/DashboardActionList'
import OrderingTable from '@/components/dashboard/OrderingTable'
import OrderingDialog from '@/components/dashboard/OrderingDialog'

import { OrderingListItem } from '@/types/display/ordering'

import { getCurrentMonthIdentifier, getMonthIdentifier } from '@/utils/month'
import { Box, Typography, Grid, Button } from '@mui/material'
import { OrderingType } from '@/types/enum'

const list: OrderingListItem[] = [
    {
        id: 1,
        productName: 'Lemon Tea',
        unitPrice: 2.5,
        quantity: 2,
        type: OrderingType.Drink,
        totalPrice: 5,
        link: 'www.example.com',
        createdBy: 'John Doe',
        updatedBy: 'John Doe',
    },
    {
        id: 2,
        productName: 'Potato Chip',
        unitPrice: 10,
        quantity: 1,
        type: OrderingType.Food,
        totalPrice: 10,
        link: 'www.example.com',
        createdBy: 'John Doe',
        updatedBy: 'John Doe',
    },
]

const itemList = [
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
    ...list,
]

const MonthlyDashboard = () => {
    const params = useParams()
    const [locked, setLocked] = useState<boolean>(false)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const selectedMonth: string = params ? params.selectedMonth as string : ''

    const onItemAddHandler = () => {
        setDialogOpen(true)
    }

    const onItemCreatedHandler = () => {
        console.log('created')
    }

    const onItemEditHandler = (item: OrderingListItem) => {
        console.log('edit', item)
    }

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DashboardTitle />
                </Grid>
                <Grid item xs={12} pb={2}>
                    <DashboardActionList onAddHandler={onItemAddHandler} />
                </Grid>
                <Grid item xs={12}>
                    <OrderingTable
                        itemList={itemList}
                        disabled={locked}
                        onItemEditHandler={onItemEditHandler}
                    />
                </Grid>
            </Grid>
            <OrderingDialog
                open={dialogOpen}
                selectedMonth={selectedMonth}
                onItemCreatedHandler={onItemCreatedHandler}
                handleClose={() => setDialogOpen(false)}
            />
        </Box>
    )
}

export default MonthlyDashboard
