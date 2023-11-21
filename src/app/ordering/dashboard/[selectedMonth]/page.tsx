'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import useUserData from '@/stores/useUserData'
import io, { Socket } from 'Socket.IO-client'

import { MonthlyOrder, Ordering } from '@prisma/client'

import DashboardTitle from '@/components/dashboard/DashboardTitle'
import DashboardActionList from '@/components/dashboard/DashboardActionList'
import OrderingTable from '@/components/dashboard/OrderingTable'
import TotalPriceSummary from '@/components/dashboard/TotalPriceSummary'

import OrderingDialog from '@/components/dashboard/OrderingDialog'
import EditOrderingDialog from '@/components/dashboard/EditOrderingDialog'
import CompleteOrderDialog from '@/components/dashboard/CompleteOrderDialog'

import {
    SocketActionData,
    SocketCompleteData,
    SocketStatusData,
} from '@/types/socket'
import { OrderingListItem } from '@/types/display/ordering'
import { MonthlyOrderStatus, SocketActionType } from '@/types/enum'

import { Box, Grid } from '@mui/material'
import {
    convertOrderingToOrderingListItem_List,
    convertSocketActionIntoToastMessage,
    convertSocketStatusIntoToastMessage,
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
    const [monthlyStatus, setMonthlyStatus] = useState<MonthlyOrderStatus>(
        MonthlyOrderStatus.Pending
    )
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('')
    const [actualPrice, setActualPrice] = useState<number | null>(null)
    const [reason, setReason] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [edittingItem, setEdittingItem] = useState<OrderingListItem | null>(
        null
    )
    const [openComplete, setOpenComplete] = useState<boolean>(false)

    const locked =
        monthlyStatus === MonthlyOrderStatus.Completed ||
        monthlyStatus === MonthlyOrderStatus.Ordering

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
                {
                    selectedMonth: data.selectedMonth,
                    userId: data.userId,
                },
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

        socket.on('status', (status: SocketStatusData) => {
            const shouldUpdate = shouldPerformAction(
                {
                    selectedMonth: status.selectedMonth,
                    userId: status.userId,
                },
                selectedMonth,
                userData?.id ?? -1
            )
            if (!shouldUpdate) return

            if (status.status !== MonthlyOrderStatus.Pending) {
                setEdittingItem(null)
                setDialogOpen(false)
            }
            const toastMessage = convertSocketStatusIntoToastMessage(status)
            toastHelper.cartUpdate(toastMessage)
            setMonthlyStatus(status.status)
        })

        socket.on('complete', (data: SocketCompleteData) => {
            const shouldUpdate = shouldPerformAction(
                {
                    selectedMonth: data.selectedMonth,
                    userId: data.userId,
                },
                selectedMonth,
                userData?.id ?? -1
            )
            if (!shouldUpdate) return

            setEdittingItem(null)
            setDialogOpen(false)
            setOpenComplete(false)
            setMonthlyStatus(MonthlyOrderStatus.Completed)
            toastHelper.cartUpdate('Order completed!')

            setActualPrice(data.actualPrice)
            setReason(data.reason)
            setExpectedDeliveryDate(data.expectedDeliveryDate)
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

            const monthlyOrder = data.orderStatus as MonthlyOrder
            setMonthlyStatus(
                (monthlyOrder.status as MonthlyOrderStatus) ??
                    MonthlyOrderStatus.Pending
            )
            if (monthlyOrder.status === MonthlyOrderStatus.Completed) {
                setExpectedDeliveryDate(monthlyOrder.expectedDeliveryDate ?? '')
                setActualPrice(monthlyOrder.actualPrice ?? null)
                setReason(monthlyOrder.reason ?? '')
            }
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

    const onSetStatusHandler = async (status: MonthlyOrderStatus) => {
        setLoading(true)

        try {
            const response = await fetch('/api/monthly/status', {
                method: 'PATCH',
                body: JSON.stringify({
                    selectedMonth: selectedMonth,
                    status: status,
                }),
            })
            const data = await response.json()
            if (data.success) {
                setMonthlyStatus(status)
                if (socket) {
                    socket.emit('setstatus', {
                        selectedMonth: selectedMonth,
                        status: status,
                    })
                }
            } else {
                toastHelper.error(data.message)
            }
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const onOrderCompleteClickHandler = () => {
        setOpenComplete(true)
    }

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

    const onCompleted = (item: MonthlyOrder) => {
        if (socket) {
            socket.emit('setcomplete', {
                selectedMonth: selectedMonth,
                reason: item.reason,
                actualPrice: item.actualPrice,
                expectedDeliveryDate: item.expectedDeliveryDate,
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
                        status={monthlyStatus}
                        onSetStatusHandler={onSetStatusHandler}
                        onOrderCompleteClickHandler={
                            onOrderCompleteClickHandler
                        }
                        expectedDeliveryDate={expectedDeliveryDate}
                        reason={reason}
                        loading={loading}
                        locked={locked}
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
                    <TotalPriceSummary
                        itemList={itemList}
                        actualPrice={actualPrice}
                    />
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
            <CompleteOrderDialog
                open={openComplete}
                selectedMonth={selectedMonth}
                onCompleted={onCompleted}
                list={itemList}
                handleClose={() => setOpenComplete(false)}
            />
        </Box>
    )
}

export default MonthlyDashboard
