'use client'

import { useEffect, useState } from 'react'
import useUserData from '@/stores/useUserData'
import { useRouter } from 'next/navigation'

import EditInformationDialog from '@/components/account/EditInformationDialog'

import { BiSolidFoodMenu } from 'react-icons/bi'
import { GiHamburger } from "react-icons/gi";
import {
    MdPersonPin,
    MdOutlineDoneAll,
    MdOutlineRemoveDone,
} from 'react-icons/md'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { FoodCompanyInformation } from '@/utils/constant'
import { Fireworks } from 'fireworks-js'

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
    
    const startFirework = () => {
        const container = document.querySelector('.firework')
        if (container) {
            const fireworks = new Fireworks(container, { /* options */ })
            fireworks.start()
        }
    }

    useEffect(() => {
        fetchUserBillDetails()
        startFirework()
    }, [])

    return (
        <Box p={3} sx={{ position: 'relative' }}>
            <div className={'firework'} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5000 }}></div>
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
                            Bill(s) you haven&apos;t recieved all money:{' '}
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

            <Grid container spacing={1} mt={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Store List
                    </Typography>
                </Grid>
                {FoodCompanyInformation.filter(s => s.activated).map((company) => (
                    <Grid item xs={4} key={company.Name}>
                        <Button
                        variant={'contained'}
                        onClick={() => window.open(company.Website, '_blank')}
                        sx={{
                            height: '100px',
                            fontSize: '20px',
                            textTransform: 'none',
                        }}
                        fullWidth
                        startIcon={<GiHamburger size={'50px'} />}
                        
                    >
                        {company.ChineseName}
                    </Button>
                </Grid>
                ))}
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
