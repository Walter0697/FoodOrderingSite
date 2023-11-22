'use client'

import React, { useState, useEffect } from 'react'
import useUserData from '@/stores/useUserData'
import BaseForm from '../common/BaseDialog'
import PasswordField from '../common/PasswordField'

import { Typography, Grid, TextField } from '@mui/material'

import toastHelper from '@/utils/toast'

type EditInformationDialogProps = {
    open: boolean
    handleClose: () => void
    onSuccessHandler: () => void
}

function EditInformationDialog({
    open,
    handleClose,
    onSuccessHandler,
}: EditInformationDialogProps) {
    const userData = useUserData((state) => state.userData)

    const [loading, setLoading] = useState<boolean>(false)

    const [oldPassword, setOldPassword] = useState<string>('')

    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
    const [favFood, setFavFood] = useState<string>('')
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        if (open && userData) {
            setOldPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
            setFavFood(userData.favFood)
            setUsername(userData.username)
        }
    }, [open, userData])

    const onSubmitHandler = async () => {
        setLoading(true)

        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                toastHelper.error('New password does not match')
                setLoading(false)
                return
            }
        }

        const data = {
            oldPassword,
            newPassword,
            newFavFood: favFood,
            newUsername: username,
        }

        try {
            const response = await fetch('/api/auth/info', {
                method: 'POST',
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
            open={open}
            loading={loading}
            title={'Edit Information'}
            onSubmitHandler={onSubmitHandler}
            handleClose={handleClose}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant={'h6'} mb={3}>
                        To verify your account, please fill in the password
                        first
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <PasswordField
                        label={'Old Password'}
                        value={oldPassword}
                        disabled={loading}
                        onChange={setOldPassword}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'h6'} mb={3}>
                        Fill in the information you want to change
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <PasswordField
                        label={'New Password (Optional)'}
                        value={newPassword}
                        disabled={loading}
                        onChange={setNewPassword}
                    />
                </Grid>
                <Grid item xs={6}>
                    <PasswordField
                        label={'Confirm New Password'}
                        value={confirmNewPassword}
                        disabled={loading}
                        onChange={setConfirmNewPassword}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label={'Username'}
                        value={username}
                        disabled={loading}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label={'Favourite Snack'}
                        value={favFood}
                        disabled={loading}
                        onChange={(e) => setFavFood(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default EditInformationDialog
