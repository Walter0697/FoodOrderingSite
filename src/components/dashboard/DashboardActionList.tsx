'use client'

import { Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { IoMdAdd } from 'react-icons/io'

import { block } from 'million/react'

type DashboardActionListProps = {
    onAddHandler: () => void
    loading: boolean
    disabled: boolean
}

function DashboardActionList({
    onAddHandler,
    loading,
    disabled,
}: DashboardActionListProps) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    disabled={disabled}
                    startIcon={<IoMdAdd />}
                    onClick={onAddHandler}
                >
                    Add Order
                </LoadingButton>
            </Grid>
        </Grid>
    )
}

const DashboardActionListBlock = block(DashboardActionList)
export default DashboardActionListBlock
