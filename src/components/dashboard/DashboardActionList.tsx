'use client'

import { Grid, Button } from '@mui/material'

import { IoMdAdd } from 'react-icons/io'

import { block } from 'million/react'

type DashboardActionListProps = {
    onAddHandler: () => void
}

function DashboardActionList({ onAddHandler }: DashboardActionListProps) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IoMdAdd />}
                    onClick={onAddHandler}
                >
                    Add Order
                </Button>
            </Grid>
        </Grid>
    )
}

const DashboardActionListBlock = block(DashboardActionList)
export default DashboardActionListBlock
