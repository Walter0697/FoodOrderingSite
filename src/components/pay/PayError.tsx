'use client'

import { Typography, Button, Box } from '@mui/material'
import { useRouter } from 'next/navigation'

import { block } from 'million/react'

type PayErrorProps = {
    title: string
    description: string
    joke: string
}

function PayError({ title, description, joke }: PayErrorProps) {
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
                    variant={'h1'}
                    sx={{
                        fontSize: '80px',
                        color: 'red',
                        textShadow: '0px 0px 10px #000000',
                        fontWeight: '800',
                    }}
                >
                    Oops
                </Typography>
                <Typography
                    variant={'h2'}
                    sx={{
                        fontSize: '30px',
                        color: 'red',
                        textShadow: '0px 0px 10px #000000',
                        fontWeight: '800',
                        mt: 2,
                    }}
                >
                    {title}
                </Typography>
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
                    {description}
                </Typography>
                <Typography
                    variant={'h6'}
                    sx={{
                        fontSize: '15px',
                        color: '#563434c9',
                        textShadow: '0px 0px 10px #000000b0',
                        fontWeight: '800',
                        mt: 2,
                        fontStyle: 'italic',
                    }}
                >
                    {joke}
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
                    Login to find your bill?
                </Button>
            </Box>
        </div>
    )
}

const PayErrorBlock = block(PayError)
export default PayErrorBlock
