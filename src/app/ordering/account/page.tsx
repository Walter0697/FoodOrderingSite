'use client'

import { useEffect, useState } from 'react'
import useUserData from '@/stores/useUserData'
import { useRouter } from 'next/navigation'

import EditInformationDialog from '@/components/account/EditInformationDialog'

import { BiSolidFoodMenu } from 'react-icons/bi'
import {
    MdPersonPin,
    MdOutlineDoneAll,
    MdOutlineRemoveDone,
} from 'react-icons/md'
import { FaMoneyBillTransfer } from 'react-icons/fa6'

import { Box, Typography, Button, Grid } from '@mui/material'

function Dashboard() {
    const router = useRouter()

    const [editingInformation, setEditingInformation] = useState(false)
    const userData = useUserData((state) => state.userData)

    const [unpaid, setUnpaid] = useState<number>(0)
    const [completed, setCompleted] = useState<number>(0)
    const [uncompleted, setUncompleted] = useState<number>(0)

    const fetchUserBillDetails = async () => {
        const response = await fetch('/api/bill/reminder')
        const result = await response.json()
        const data = result.data

        setUnpaid(data.unpaidNumber)
        setCompleted(data.completedNumber)
        setUncompleted(data.unCompleteNumber)
    }

    useEffect(() => {
        fetchUserBillDetails()
    }, [])

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4" mb={5}>
                        Welcome back, {userData && userData.displayname}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant={'contained'}
                        onClick={() => router.push('/ordering/dashboard')}
                        sx={{
                            height: '100px',
                            fontSize: '30px',
                            textTransform: 'none',
                        }}
                        fullWidth
                        startIcon={<BiSolidFoodMenu size={'50px'} />}
                    >
                        Start Ordering
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant={'contained'}
                        onClick={() => setEditingInformation(true)}
                        sx={{
                            height: '100px',
                            fontSize: '30px',
                            textTransform: 'none',
                        }}
                        fullWidth
                        startIcon={<MdPersonPin size={'50px'} />}
                    >
                        Edit Information
                    </Button>
                </Grid>

                {unpaid !== 0 && (
                    <Grid item xs={6}>
                        <Button
                            variant={'contained'}
                            onClick={() => router.push('/bill/list')}
                            sx={{
                                height: '100px',
                                fontSize: '20px',
                                textTransform: 'none',
                            }}
                            fullWidth
                            startIcon={<FaMoneyBillTransfer size={'50px'} />}
                        >
                            Unpaid Bill(s): {unpaid}
                        </Button>
                    </Grid>
                )}

                {uncompleted !== 0 && (
                    <Grid item xs={6}>
                        <Button
                            variant={'contained'}
                            onClick={() => router.push('/bill/mybill')}
                            sx={{
                                height: '100px',
                                fontSize: '20px',
                                textTransform: 'none',
                            }}
                            fullWidth
                            startIcon={<MdOutlineRemoveDone size={'50px'} />}
                        >
                            Bill(s) you haven't recieved all money:{' '}
                            {uncompleted}
                        </Button>
                    </Grid>
                )}

                {completed !== 0 && (
                    <Grid item xs={6}>
                        <Button
                            variant={'contained'}
                            onClick={() => router.push('/bill/mybill')}
                            sx={{
                                height: '100px',
                                fontSize: '20px',
                                textTransform: 'none',
                            }}
                            fullWidth
                            startIcon={<MdOutlineDoneAll size={'50px'} />}
                        >
                            Bill(s) every paid you already: {completed}
                        </Button>
                    </Grid>
                )}
            </Grid>

            <EditInformationDialog
                open={editingInformation}
                handleClose={() => setEditingInformation(false)}
                onSuccessHandler={() => {
                    window.location.reload()
                }}
            />
        </Box>
    )
}

export default Dashboard
