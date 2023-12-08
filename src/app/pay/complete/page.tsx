'use client'

import { Grid, Button, Typography, Box } from '@mui/material'
import { useRouter } from 'next/navigation'

function CompletePage() {
    const router = useRouter()

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: 'gray',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    pt: 3,
                }}
            >
                <Typography
                    variant={'h3'}
                    sx={{
                        fontSize: '20px',
                        color: '#600000c9',
                        textShadow: '0px 0px 10px #000000',
                        fontWeight: '800',
                        mt: 5,
                        fontStyle: 'italic',
                    }}
                >
                    You have successfully paid your bill!
                </Typography>

                <Button
                    variant={'contained'}
                    onClick={() => {
                        router.push('/login')
                    }}
                    sx={{
                        mt: 6,
                        fontStyle: 'italic',
                    }}
                >
                    Login to see more details
                </Button>
            </Box>
        </div>
    )
}

export default CompletePage
