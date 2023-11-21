'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

import { Ordering } from '@prisma/client'

import DashboardTitle from '@/components/dashboard/DashboardTitle'
import DashboardActionList from '@/components/dashboard/DashboardActionList'
import OrderingTable from '@/components/dashboard/OrderingTable'
import OrderingDialog from '@/components/dashboard/OrderingDialog'
import TotalPriceOverlay from '@/components/dashboard/TotalPriceOverlay'

import { OrderingListItem } from '@/types/display/ordering'

import { Box, Grid } from '@mui/material'
import { convertOrderingToOrderingListItem_List } from '@/utils/display'
import toastHelper from '@/utils/toast'
import EditOrderingDialog from '@/components/dashboard/EditOrderingDialog'

const MonthlyDashboard = () => {
    const params = useParams()

    const [itemList, setItemList] = useState<OrderingListItem[]>([])
    const [locked, setLocked] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [edittingItem, setEdittingItem] = useState<OrderingListItem | null>(
        null
    )

    const selectedMonth: string = params ? (params.selectedMonth as string) : ''

    const refetch = async () => {
        setLoading(true)
        try {
            const result = await fetch(
                `/api/ordering/list?selectedMonth=${selectedMonth}`
            )
            const data = await result.json()
            const resultList = convertOrderingToOrderingListItem_List(
                data.list as Ordering[]
            )
            setItemList(resultList)
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedMonth) return
        refetch()
    }, [selectedMonth])

    const onItemAddHandler = () => {
        setDialogOpen(true)
    }

    const onItemCreatedHandler = () => {
        refetch()
    }

    const onItemEditedHandler = () => {
        refetch()
    }

    const onItemRemoveHandler = (item: OrderingListItem) => {
        refetch()
    }

    const onItemEditHandler = (item: OrderingListItem) => {
        setEdittingItem(item)
    }

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <DashboardTitle />
                </Grid>
                <Grid item xs={12} pb={2}>
                    <DashboardActionList
                        onAddHandler={onItemAddHandler}
                        loading={locked || loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <OrderingTable
                        itemList={itemList}
                        disabled={locked || loading}
                        onItemEditHandler={onItemEditHandler}
                        onItemRemoveHandler={onItemRemoveHandler}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TotalPriceOverlay itemList={itemList} />
                </Grid>
            </Grid>

            <OrderingDialog
                open={dialogOpen}
                selectedMonth={selectedMonth}
                onItemCreatedHandler={onItemCreatedHandler}
                handleClose={() => setDialogOpen(false)}
            />
            <EditOrderingDialog
                open={edittingItem !== null}
                item={edittingItem ?? undefined}
                onItemEditedHandler={onItemEditedHandler}
                handleClose={() => setEdittingItem(null)}
            />
        </Box>
    )
}

export default MonthlyDashboard
