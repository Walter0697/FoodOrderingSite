'use client'

import React, { useState, useEffect } from 'react'

import { UserListItem } from '@/types/display/user'
import BaseForm from '../common/BaseDialog'

import { Typography, Grid, Switch } from '@mui/material'

import toastHelper from '@/utils/toast'

type UserEditDialogProps = {
    open: boolean
    user: UserListItem | null
    handleClose: () => void
    onSuccessHandler: () => void
}

function UserEditDialog({
    open,
    user,
    handleClose,
    onSuccessHandler,
}: UserEditDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [activated, setActivated] = useState<boolean>(false)

    useEffect(() => {
        if (open && user) {
            setActivated(user.activated)
        }
    }, [open, user])

    const onSubmitHandler = async () => {
        setLoading(true)
        if (!user) {
            setLoading(false)
            return
        }

        const data = {
            activated,
        }

        try {
            const response = await fetch(`/api/user/update/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!result.success) {
                toastHelper.error(result.message)
                setLoading(false)
                return
            }

            toastHelper.success('Successfully updated information')
            handleClose()
            onSuccessHandler()
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
            title="Edit User"
            open={open}
            loading={loading}
            handleClose={handleClose}
            onSubmitHandler={onSubmitHandler}
        >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography variant="h6">Username</Typography>
                    <Typography variant="body1">
                        {user?.username ?? ''}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h6">Display Name</Typography>
                    <Typography variant="body1">
                        {user?.displayname ?? ''}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h6">Rank</Typography>
                    <Typography variant="body1">{user?.rank ?? ''}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Activated</Typography>
                    <Switch
                        checked={activated}
                        onChange={(e) => setActivated(e.target.checked)}
                        disabled={loading}
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default UserEditDialog
