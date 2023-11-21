'use client'

import useUserData from '@/stores/useUserData'

import { Grid, Typography, Tooltip, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { MonthlyOrderStatus } from '@/types/enum'

import { IoMdAdd } from 'react-icons/io'
import { FaLock, FaLockOpen, FaMoneyBillWave } from 'react-icons/fa'

import { block } from 'million/react'

type DashboardActionListProps = {
    onAddHandler: () => void
    status: MonthlyOrderStatus
    onSetStatusHandler: (status: MonthlyOrderStatus) => void
    onOrderCompleteClickHandler: () => void
    loading: boolean
    disabled: boolean
    locked: boolean
    expectedDeliveryDate: string
    reason: string
}

function DashboardActionList({
    onAddHandler,
    status,
    onSetStatusHandler,
    onOrderCompleteClickHandler,
    loading,
    locked,
    disabled,
    expectedDeliveryDate,
    reason,
}: DashboardActionListProps) {
    const userData = useUserData((state) => state.userData)
    const isAdmin = userData ? userData.rank === 'admin' : false

    const onLockOrderingHandle = () => {
        onSetStatusHandler(MonthlyOrderStatus.Ordering)
    }

    const onUnlockOrderingHandle = () => {
        onSetStatusHandler(MonthlyOrderStatus.Pending)
    }

    const onCompleteOrdering = () => {
        onOrderCompleteClickHandler()
    }

    return (
        <Grid container spacing={0}>
            {status !== MonthlyOrderStatus.Completed && (
                <Grid item xs={3}>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={disabled || locked}
                        startIcon={<IoMdAdd />}
                        onClick={onAddHandler}
                    >
                        Add Order
                    </LoadingButton>
                </Grid>
            )}
            {status === MonthlyOrderStatus.Completed && (
                <>
                    <Grid item xs={8}>
                        <Typography variant={'h6'}>
                            Ordered! Expected Delivery Date:{' '}
                            {expectedDeliveryDate}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        display={'flex'}
                        justifyContent={'flex-end'}
                    >
                        <Tooltip
                            title={
                                <>
                                    {reason.split('\n').map((row, index) => (
                                        <Typography
                                            variant={'h6'}
                                            key={`${index}-reason`}
                                        >
                                            {row}
                                        </Typography>
                                    ))}
                                </>
                            }
                            placement="bottom-start"
                        >
                            <Button variant={'contained'}>Notes</Button>
                        </Tooltip>
                    </Grid>
                </>
            )}
            {isAdmin && status === MonthlyOrderStatus.Pending && (
                <Grid item xs={9} display={'flex'} justifyContent={'flex-end'}>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={disabled}
                        startIcon={<FaLock />}
                        onClick={onLockOrderingHandle}
                    >
                        Lock Orderings
                    </LoadingButton>
                </Grid>
            )}
            {isAdmin && status === MonthlyOrderStatus.Ordering && (
                <Grid item xs={9} display={'flex'} justifyContent={'flex-end'}>
                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={loading}
                        disabled={disabled}
                        startIcon={<FaLockOpen />}
                        onClick={onUnlockOrderingHandle}
                    >
                        Unlock Orderings
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={loading}
                        disabled={disabled}
                        startIcon={<FaMoneyBillWave />}
                        onClick={onCompleteOrdering}
                        sx={{
                            ml: 2,
                        }}
                    >
                        Completed Order
                    </LoadingButton>
                </Grid>
            )}
        </Grid>
    )
}

const DashboardActionListBlock = block(DashboardActionList)
export default DashboardActionListBlock
