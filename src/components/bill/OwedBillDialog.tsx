'use client'

import React, { useState, useEffect } from 'react'

import { DetailedBill, DetailedBillPaidRecord } from '@/types/model'
import BaseForm from '../common/BaseDialog'
import BillPaidRecordTable from './BillPaidRecordTable'

import { Typography, Grid, TextField } from '@mui/material'

import toastHelper from '@/utils/toast'
import ServerImage from '../ServerImage'

type OwedBillDialogProps = {
    open: boolean
    bill: DetailedBill | null
    userId: number
    handleClose: () => void
    onSuccessHandler: () => void
}

function OwedBillDialog({
    open,
    bill,
    userId,
    handleClose,
    onSuccessHandler,
}: OwedBillDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [hasBillDetails, setHasBillDetails] = useState<boolean>(false)
    const [hasMyPaidAmount, setHasMyPaidAmount] = useState<boolean>(false)
    const [currentBillList, setCurrentBillList] = useState<
        DetailedBillPaidRecord[]
    >([])

    const [currentPaidAmount, setCurrentPaidAmount] = useState<string>('')
    const [notes, setNotes] = useState<string>('')

    const fetchBillDetails = async () => {
        setLoading(true)
        setHasMyPaidAmount(false)
        try {
            const response = await fetch(`/api/bill/paidlist/${bill?.id}`)

            const result = await response.json()
            const list: DetailedBillPaidRecord[] = result.records
            const myPaidAmount = list.find((item) => item.createdBy === userId)

            if (myPaidAmount) {
                setHasMyPaidAmount(true)
                setNotes(myPaidAmount.notes ?? '')
                setCurrentPaidAmount(myPaidAmount.Amount.toString())
            }
            setCurrentBillList(list)

            setHasBillDetails(true)
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async () => {
        setLoading(true)

        try {
            if (!currentPaidAmount) {
                toastHelper.error('Paid Amount is required')
                setLoading(false)
                return
            }

            const priceRegex = /^\d+(\.\d{1,2})?$/
            if (!priceRegex.test(currentPaidAmount)) {
                toastHelper.error('Price Amount is invalid')
                setLoading(false)
                return
            }

            const postBody = {
                billId: bill?.id,
                paidAmount: currentPaidAmount,
                notes: notes,
            }

            const response = await fetch('/api/bill/paid', {
                method: 'POST',
                body: JSON.stringify(postBody),
            })
            const result = await response.json()
            if (result.success) {
                toastHelper.success('Bill paid')
                refetchBillDetails()
                onSuccessHandler()
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

    const refetchBillDetails = () => {
        setHasBillDetails(false)
        fetchBillDetails()
    }

    useEffect(() => {
        if (open && bill) {
            setNotes('')
            setCurrentPaidAmount('')
            refetchBillDetails()
        }
    }, [open, bill])

    return (
        <BaseForm
            title="Bill Details"
            open={open}
            loading={loading}
            handleClose={handleClose}
            onSubmitHandler={onSubmitHandler}
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
                <Grid item xs={12}>
                    <Typography variant={'h6'}>
                        {hasMyPaidAmount
                            ? 'Enter your paid amount here'
                            : 'Edit your paid amount here'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        disabled={!hasBillDetails}
                        label={'Your Paid Amount'}
                        value={currentPaidAmount}
                        onChange={(e) => setCurrentPaidAmount(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        disabled={!hasBillDetails}
                        label={'Notes'}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default OwedBillDialog
