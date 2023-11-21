'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import BaseForm from '@/components/common/BaseDialog'
import TotalPriceSummary from '@/components/dashboard/TotalPriceSummary'

import { Typography, Grid, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDateTimePicker as DTPicker } from '@mui/x-date-pickers/DesktopDateTimePicker'

import { MonthlyOrder } from '@prisma/client'
import { OrderingListItem } from '@/types/display/ordering'

import { StaticPath } from '@/utils/constant'
import toastHelper from '@/utils/toast'
import dayjs from 'dayjs'

type CompleteOrderDialogProps = {
    open: boolean
    selectedMonth: string
    list: OrderingListItem[]
    onCompleted: (item: MonthlyOrder) => void
    handleClose: () => void
}

function CompleteOrderDialog({
    open,
    selectedMonth,
    list,
    onCompleted,
    handleClose,
}: CompleteOrderDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const [reason, setReason] = useState<string>('')
    const [actualPrice, setActualPrice] = useState<number>(0)
    const [expectedDeliveryDate, setExpectedDeliveryDate] =
        useState<Date | null>(null)

    useEffect(() => {
        setLoading(false)
        setReason('')
        setActualPrice(0)
        setExpectedDeliveryDate(null)
    }, [open])

    const onSubmitHandler = async () => {
        if (!expectedDeliveryDate || !reason || !actualPrice) {
            toastHelper.error('Please fill in all information')
            return
        }
        const postBody = {
            reason,
            actualPrice,
            expectedDeliveryDate: dayjs(expectedDeliveryDate).format('YYYY-MM'),
            selectedMonth,
        }

        setLoading(true)
        try {
            const response = await fetch('/api/monthly/complete', {
                method: 'POST',
                body: JSON.stringify(postBody),
            })

            if (response.status === 401) {
                router.push(StaticPath.HomePage)
            }

            const result = await response.json()
            if (result.success) {
                toastHelper.success('Order completed')
                const data = result.data as MonthlyOrder
                onCompleted(data)
                handleClose()
            } else {
                toastHelper.error(result.message)
            }
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseForm
            open={open}
            loading={loading}
            title={'Completing Order'}
            onSubmitHandler={onSubmitHandler}
            handleClose={handleClose}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} pl={2}>
                    <Typography variant={'h5'}>
                        Summary for {selectedMonth}:{' '}
                    </Typography>
                </Grid>
                <Grid item xs={12} pb={2}>
                    <TotalPriceSummary itemList={list} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label={'Actual Price'}
                        value={actualPrice}
                        onChange={(e) => {
                            // can only input integer
                            if (isNaN(parseInt(e.target.value))) return
                            const final = parseInt(e.target.value)
                            setActualPrice(final)
                        }}
                        disabled={loading}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DTPicker
                            value={expectedDeliveryDate}
                            onChange={setExpectedDeliveryDate}
                            label={'Expected delivery date'}
                            disabled={loading}
                            views={['year', 'month', 'day']}
                            format={'YYYY-MM-DD'}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label={'Reasons (if any)'}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        variant={'outlined'}
                        fullWidth
                        multiline
                        rows={5}
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default CompleteOrderDialog
