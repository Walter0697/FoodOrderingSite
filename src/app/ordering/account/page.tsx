'use client'

import useUserData from '@/stores/useUserData'
import { useRouter } from 'next/navigation'

import { BiSolidFoodMenu } from 'react-icons/bi'

import { Box, Typography, Button } from '@mui/material'

function Dashboard() {
    const router = useRouter()
    const userData = useUserData((state) => state.userData)

    return (
        <Box p={3}>
            <Typography variant="h4" mb={5}>
                Welcome back, {userData && userData.displayname}
            </Typography>
            <Typography variant="h6" pb={1}>
                Start Shopping at:
            </Typography>
            <Button
                variant={'contained'}
                onClick={() => router.push('/ordering/dashboard')}
                sx={{
                    width: '50vw',
                    height: '100px',
                    fontSize: '30px',
                    textTransform: 'none',
                }}
                startIcon={<BiSolidFoodMenu size={'50px'} />}
            >
                Ordering Dashboard
            </Button>
        </Box>
    )
}

export default Dashboard
