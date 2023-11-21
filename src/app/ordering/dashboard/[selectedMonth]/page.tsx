'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import useUserData from '@/stores/useUserData'
import io, { Socket } from 'Socket.IO-client'

import { Ordering } from '@prisma/client'

import DashboardTitle from '@/components/dashboard/DashboardTitle'
import DashboardActionList from '@/components/dashboard/DashboardActionList'
import OrderingTable from '@/components/dashboard/OrderingTable'
import OrderingDialog from '@/components/dashboard/OrderingDialog'
import TotalPriceOverlay from '@/components/dashboard/TotalPriceOverlay'
import EditOrderingDialog from '@/components/dashboard/EditOrderingDialog'

import { SocketActionData } from '@/types/socket'
import { OrderingListItem } from '@/types/display/ordering'
import { SocketActionType } from '@/types/enum'

import { Box, Grid } from '@mui/material'
import {
    convertOrderingToOrderingListItem_List,
    convertSocketActionIntoToastMessage,
    shouldPerformAction,
} from '@/utils/display'
import { performActionOnList } from '@/utils/list'
import { monthAllowEdit } from '@/utils/month'
import toastHelper from '@/utils/toast'

let socket: Socket | null = null
let itemListStored: OrderingListItem[] = []

const MonthlyDashboard = () => {
    const params = useParams()
    const userData = useUserData((state) => state.userData)

    const [itemList, setItemList] = useState<OrderingListItem[]>([])
    const [locked, setLocked] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [edittingItem, setEdittingItem] = useState<OrderingListItem | null>(
        null
    )

    const selectedMonth: string = params ? (params.selectedMonth as string) : ''
    const allowEdit = monthAllowEdit(selectedMonth)

    const setCurrentItemList = (list: OrderingListItem[]) => {
        setItemList(list)
        itemListStored = list
    }

    useEffect(() => {
        if (!userData) return
        socketInitializer()
    }, [userData])

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('socket connected to server')
            if (socket) {
                socket.emit('initialze', userData)
            }
        })

        socket.on('action', (data: SocketActionData) => {
            const shouldUpdate = shouldPerformAction(
                data,
                selectedMonth,
                userData?.id ?? -1
            )
            if (!shouldUpdate) return
            // show the toast message
            const toastMessage = convertSocketActionIntoToastMessage(data)
            toastHelper.cartUpdate(toastMessage)

            const newList = performActionOnList(itemListStored, data)
            setCurrentItemList(newList)
        })
    }

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
            setCurrentItemList(resultList)
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

    const onItemCreatedHandler = (item: Partial<SocketActionData>) => {
        if (socket) {
            socket.emit('performed', item)
        }
        refetch()
    }

    const onItemEditedHandler = (item: Partial<SocketActionData>) => {
        if (socket) {
            socket.emit('performed', item)
        }
        refetch()
    }

    const onItemRemoveHandler = (item: OrderingListItem) => {
        if (socket) {
            socket.emit('performed', {
                actionType: SocketActionType.Remove,
                productName: item.productName,
                selectedMonth: selectedMonth,
                orderId: item.id,
            })
        }
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
                        disabled={!allowEdit}
                    />
                </Grid>
                <Grid item xs={12}>
                    <OrderingTable
                        itemList={itemList}
                        disabled={locked || loading || !allowEdit}
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
                selectedMonth={selectedMonth}
                onItemEditedHandler={onItemEditedHandler}
                handleClose={() => setEdittingItem(null)}
            />
        </Box>
    )
}

export default MonthlyDashboard
