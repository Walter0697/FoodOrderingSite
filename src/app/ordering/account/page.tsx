'use client'

import { useState } from 'react'
import useUserData from '@/stores/useUserData'
import { useRouter } from 'next/navigation'

import EditInformationDialog from '@/components/account/EditInformationDialog'

import { BiSolidFoodMenu } from 'react-icons/bi'
import { MdPersonPin } from 'react-icons/md'

import { Box, Typography, Button, Grid } from '@mui/material'

function Dashboard() {
    const router = useRouter()

    const [editingInformation, setEditingInformation] = useState(false)
    const userData = useUserData((state) => state.userData)

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
