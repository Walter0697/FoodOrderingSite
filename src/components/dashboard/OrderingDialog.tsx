'use client'

import React, { useState } from 'react'
import BaseForm from '../common/BaseDialog'

import { Typography, Grid, TextField } from '@mui/material'

import { checkURLValid } from '@/utils/orders'
import toastHelper from '@/utils/toast'

type OrderingDialogProps = {
    open: boolean
    onItemCreatedHandler: () => void
    handleClose: () => void
}

function OrderingDialog({
    open,
    onItemCreatedHandler,
    handleClose,
}: OrderingDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [link, setLink] = useState<string>('')

    const onSubmitHandler = async () => {
        setLoading(true)

        try {
            const trimmedLink = link.trim()
            if (!trimmedLink) {
                return
            }
            if (!checkURLValid(trimmedLink)) {
                toastHelper.error('Invalid URL')
                return
            }
        } catch (err: Error | unknown) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseForm
            open={open}
            loading={loading}
            title={'Searching Products...'}
            onSubmitHandler={onSubmitHandler}
            handleClose={handleClose}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <Typography variant="h6">
                        Please input the link here:
                    </Typography>
                </Grid>
                <Grid item xs={12} pl={3} pr={3}>
                    <TextField
                        disabled={loading}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default OrderingDialog
