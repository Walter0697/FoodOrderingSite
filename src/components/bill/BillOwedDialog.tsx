'use client'

import React, { useState, useEffect } from 'react'

import { DetailedBill, DetailedBillPaidRecord } from '@/types/model'
import BaseForm from '../common/BaseDialog'
import BillPaidRecordTable from './BillPaidRecordTable'

import { SelectOptions } from '@/types/common'

import { Button, Grid, Typography } from '@mui/material'

import toastHelper from '@/utils/toast'
import ServerImage from '../ServerImage'

type BillOwedDialogProps = {
    open: boolean
    bill: DetailedBill | null
    userId: number
    userList: SelectOptions[]
    handleClose: () => void
    onSuccessHandler: () => void
}

function BillOwedDialog({
    open,
    bill,
    userId,
    userList,
    handleClose,
    onSuccessHandler,
}: BillOwedDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [hasBillDetails, setHasBillDetails] = useState<boolean>(false)
    const [currentBillList, setCurrentBillList] = useState<
        DetailedBillPaidRecord[]
    >([])
    const [unpaidMessage, setUnpaidMessage] = useState<string>('')

    const fetchBillDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/bill/paidlist/${bill?.id}`)

            const result = await response.json()
            const list: DetailedBillPaidRecord[] = result.records
            setCurrentBillList(list)
            setHasBillDetails(true)

            const targetUsers = bill?.targetUsers ?? []
            const unpaidUsers: string[] = []
            for (let i = 0; i < targetUsers.length; i++) {
                const targetUser = targetUsers[i]
                const found = list.find(
                    (record) => record.createdBy === targetUser
                )
                if (!found) {
                    const user = userList.find((s) => s.value === targetUser)
                    if (user) {
                        unpaidUsers.push(user.label)
                    }
                }
            }
            if (unpaidUsers.length !== 0) {
                setUnpaidMessage(`Unpaid users: ${unpaidUsers.join(', ')}`)
            } else {
                setUnpaidMessage('Every target users paid for this bill')
            }
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const refetchBillDetails = () => {
        setUnpaidMessage('')
        setHasBillDetails(false)
        fetchBillDetails()
    }

    const onCompleteClick = async () => {
        const confirmed = window.confirm(
            'Are you sure to complete this bill? This action cannot be undone.'
        )
        if (!confirmed) return

        setLoading(true)
        try {
            const response = await fetch(`/api/bill/complete/${bill?.id}`, {
                method: 'POST',
            })
            const result = await response.json()

            if (result.success) {
                toastHelper.success('Bill completed.')
                onSuccessHandler()
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

    useEffect(() => {
        if (open && bill) {
            refetchBillDetails()
        }
    }, [open, bill])

    return (
        <BaseForm
            title="Bill Details"
            open={open}
            loading={loading}
            handleClose={handleClose}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
            >
                {bill && (
                    <>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={6}>
                            <ServerImage src={bill.photoUrl} />
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </>
                )}

                {currentBillList.length > 0 && (
                    <Grid item xs={12}>
                        <BillPaidRecordTable
                            itemList={currentBillList}
                            userId={userId}
                        />
                    </Grid>
                )}

                <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <Typography variant={'h6'}>{unpaidMessage}</Typography>
                </Grid>

                <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <Button
                        variant={'contained'}
                        onClick={onCompleteClick}
                        disabled={!hasBillDetails}
                    >
                        Complete Bill
                    </Button>
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default BillOwedDialog
