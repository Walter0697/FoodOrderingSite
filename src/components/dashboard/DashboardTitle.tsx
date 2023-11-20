'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDateTimePicker as DTPicker } from '@mui/x-date-pickers/DesktopDateTimePicker'

import { getCurrentMonthIdentifier, getMonthIdentifier } from '@/utils/month'
import { Typography, Grid, Button } from '@mui/material'

import { block } from 'million/react'

function DashboardTitle() {
    const router = useRouter()
    const params = useParams()
    const [currentMonth, setCurrentMonth] = useState<string | null>(null)

    const selectedMonth = params ? params.selectedMonth : ''

    const [gotoMonth, setGotoMonth] = useState<Date | null>(null)
    const onGoToMonthHandler = () => {
        if (!gotoMonth) {
            return
        }
        const monthIdentifier = getMonthIdentifier(gotoMonth)
        router.push(`/ordering/dashboard/${monthIdentifier}`)
    }

    useEffect(() => {
        setCurrentMonth(getCurrentMonthIdentifier())
    }, [])

    return (
        <Grid container spacing={0} pb={2}>
            <Grid item xs={6}>
                <Typography variant="h6" mb={5}>
                    Orderings for{' '}
                    <span style={{ color: 'blue' }}>
                        {selectedMonth}
                        {selectedMonth === currentMonth
                            ? ' (Current Month)'
                            : ''}
                    </span>
                </Typography>
            </Grid>
            <Grid
                item
                xs={6}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <Grid container spacing={1}>
                    <Grid
                        item
                        xs={10}
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DTPicker
                                value={gotoMonth}
                                onChange={setGotoMonth}
                                label={'Go to Month'}
                                disabled={false}
                                views={['year', 'month']}
                                format={'YYYY-MM'}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2} sx={{ height: '100%' }}>
                        <Button
                            variant={'outlined'}
                            sx={{ height: '80%' }}
                            disabled={!gotoMonth}
                            onClick={onGoToMonthHandler}
                            fullWidth
                        >
                            Go!
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

const DashboardTitleBlock = block(DashboardTitle)
export default DashboardTitleBlock
