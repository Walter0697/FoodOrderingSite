'use client'

import { useState, useEffect } from 'react'
import { Typography, Button, Box, Grid, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'

import ServerImage from '@/components/ServerImage'
import CalculatorField from '@/components/common/CalculatorField'

import toastHelper from '@/utils/toast'

type PayFormProps = {
    token: string
    restaurantName: string
    photoUrl: string
    notes: string
    uploadUser: string
    displayName: string
    paidAmount?: number
    paidTime?: string
    paidNotes?: string
}

function PayForm({
    token,
    restaurantName,
    photoUrl,
    notes,
    uploadUser,
    displayName,
    paidAmount,
    paidTime,
    paidNotes,
}: PayFormProps) {
    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false)
    const [amount, setAmount] = useState<string>('')
    const [currentNotes, setNotes] = useState<string>('')

    useEffect(() => {
        if (paidAmount) {
            setAmount(paidAmount.toString())
        }
        if (paidNotes) {
            setNotes(paidNotes)
        }
    }, [paidAmount, paidTime, paidNotes])

    const onSubmitHandler = async () => {
        setLoading(true)

        try {
            if (!amount) {
                toastHelper.error('Paid Amount is required')
                setLoading(false)
                return
            }

            const priceRegex = /^\d+(\.\d{1,2})?$/
            if (!priceRegex.test(amount)) {
                toastHelper.error('Paid Amount is invalid')
                setLoading(false)
                return
            }

            const postBody = {
                token: token,
                paidAmount: amount,
                notes: currentNotes,
            }

            const response = await fetch('/api/bill/paidbytoken', {
                method: 'POST',
                body: JSON.stringify(postBody),
            })
            const result = await response.json()
            if (result.success) {
                toastHelper.success('Bill paid')
                router.push('/pay/complete')
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
        <Box
            sx={{
                p: 3,
                backgroundColor: 'gray',
                minHeight: '100vh',
                width: '100vw',
                overflow: 'scroll',
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant="h4">
                        Hi, {displayName}, you are paying for the bill of{' '}
                        <span
                            style={{
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                color: 'blue',
                            }}
                        >
                            {restaurantName}
                        </span>{' '}
                        to{' '}
                        <span
                            style={{
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                color: 'blue',
                            }}
                        >
                            {uploadUser}
                        </span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <ServerImage src={photoUrl} />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault()
                            onSubmitHandler && onSubmitHandler()
                        }}
                    >
                        <Grid container spacing={1} sx={{ p: 1 }}>
                            <Grid item xs={12}>
                                {notes && (
                                    <>
                                        <Typography variant="h6">
                                            {uploadUser}'s Notes
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ mb: 2 }}
                                        >
                                            {notes}
                                        </Typography>
                                    </>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <CalculatorField
                                    fullWidth
                                    disabled={loading}
                                    value={amount}
                                    onChange={setAmount}
                                    variant="outlined"
                                    label={'Amount (You can equation here)'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    disabled={loading}
                                    value={currentNotes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    variant="outlined"
                                    label={'Notes'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    disabled={loading}
                                    variant={'contained'}
                                    type={'submit'}
                                    fullWidth
                                >
                                    Confirm
                                </Button>
                            </Grid>

                            {paidTime && (
                                <Grid item xs={12}>
                                    <Typography
                                        variant={'body1'}
                                        sx={{
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        You paid {paidAmount} at {paidTime}{' '}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PayForm
