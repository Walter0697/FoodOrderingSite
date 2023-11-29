'use client'

import React, { useState, useEffect } from 'react'

import { DetailedBill } from '@/types/model'
import BaseForm from '../common/BaseDialog'

import { Typography, Grid, Switch } from '@mui/material'

import toastHelper from '@/utils/toast'
import ServerImage from '../ServerImage'

type OwedBillDialogProps = {
    open: boolean
    bill: DetailedBill | null
    handleClose: () => void
    onSuccessHandler: () => void
}

function OwedBillDialog({
    open,
    bill,
    handleClose,
    onSuccessHandler,
}: OwedBillDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const fetchBillDetails = async () => {
        setLoading(true)
        try {
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
            fetchBillDetails()
        }
    }, [open, bill])

    return (
        <BaseForm
            title="Bill Details"
            open={open}
            loading={loading}
            handleClose={handleClose}
            onSubmitHandler={onSuccessHandler}
        >
            <Grid container spacing={2}>
                {bill && (
                    <Grid item xs={12}>
                        <ServerImage src={bill.photoUrl} />
                    </Grid>
                )}
            </Grid>
        </BaseForm>
    )
}

export default OwedBillDialog
