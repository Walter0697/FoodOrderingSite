'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import DashboardTitle from '@/components/dashboard/DashboardTitle'
import OrderingTable from '@/components/dashboard/OrderingTable'

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
    const selectedMonth = params ? params.selectedMonth : ''

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DashboardTitle />
                </Grid>

                <Grid item xs={12}>
                    <OrderingTable itemList={itemList} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default MonthlyDashboard
