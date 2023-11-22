'use client'

import React, { useState, useEffect } from 'react'
import BaseForm from '../common/BaseDialog'
import PasswordField from '../common/PasswordField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDateTimePicker as DTPicker } from '@mui/x-date-pickers/DesktopDateTimePicker'

import { Typography, Grid, TextField } from '@mui/material'

import dayjs from 'dayjs'
import toastHelper from '@/utils/toast'

type FirstLoginDialogProps = {
    open: boolean
    username: string
    displayName: string
    onSuccessHandler: () => void
    handleClose: () => void
}

function FirstLoginDialog({
    open,
    username,
    displayName,
    onSuccessHandler,
    handleClose,
}: FirstLoginDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [birthday, setBirthday] = useState<Date | null>(null)
    const [favFood, setFavFood] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    useEffect(() => {
        if (open) {
            setBirthday(null)
            setFavFood('')
            setPassword('')
            setConfirmPassword('')
        }
    }, [open])

    const onSubmitHandler = async () => {
        setLoading(true)

        // check if all fields have been filled
        if (!birthday || !favFood || !password || !confirmPassword) {
            toastHelper.error('Please fill in all fields')
            setLoading(false)
            return
        }

        if (!dayjs(birthday).isValid()) {
            toastHelper.error('Invalid Birthday')
            setLoading(false)
            return
        }

        // check if password and confirm password are the same
        if (password !== confirmPassword) {
            toastHelper.error('Password and confirm password are not the same')
            setLoading(false)
            return
        }

        // check if birthday is less than 2001, since all of us should be born before 2001 in my company :p
        if (dayjs(birthday).isAfter(dayjs('2001-01-01'))) {
            toastHelper.error(
                'Cannot verify your identity, please fill in the correct information'
            )
            setLoading(false)
            return
        }

        const data = {
            username: username,
            birthday: dayjs(birthday).format('YYYY-MM-DD'),
            favFood,
            password,
        }

        try {
            const response = await fetch('/api/auth/activate', {
                method: 'POST',
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!result.success) {
                toastHelper.error(result.message)
                return
            }

            toastHelper.success(
                'Activated successfully, please login again with the new password.'
            )
            onSuccessHandler && onSuccessHandler()
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
            title={'Activate your account'}
            onSubmitHandler={onSubmitHandler}
            handleClose={handleClose}
        >
            <Typography variant={'h5'}>
                Hi {displayName}, looks like this is the first time you login to
                this system.
            </Typography>
            <Typography variant={'h6'} mb={3}>
                To activate your account, please fill in the following
                information in order to verify your identity.
            </Typography>

            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DTPicker
                            value={birthday}
                            onChange={setBirthday}
                            label={'Birthday'}
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
                <Grid item xs={6}>
                    <TextField
                        value={favFood}
                        onChange={(e) => setFavFood(e.target.value)}
                        label={'Your favourite snack'}
                        disabled={loading}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <PasswordField
                        label={'Password'}
                        value={password}
                        disabled={loading}
                        onChange={setPassword}
                    />
                </Grid>
                <Grid item xs={6}>
                    <PasswordField
                        label={'Confirm Password'}
                        value={confirmPassword}
                        disabled={loading}
                        onChange={setConfirmPassword}
                    />
                </Grid>
            </Grid>
        </BaseForm>
    )
}

export default FirstLoginDialog
