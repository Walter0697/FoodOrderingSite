'use client'

import { Typography, Grid, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

import { block } from 'million/react'

type BillTitleProps = {
    ownedBill: boolean
}

function BillTitle({ ownedBill }: BillTitleProps) {
    const router = useRouter()

    const goToUploadPage = () => {
        router.push('/bill/upload')
    }

    const goToNextPage = () => {
        if (ownedBill) {
            router.push('/bill/mybill')
        } else {
            router.push('/bill/list')
        }
    }

    return (
        <Grid container spacing={0} pb={2}>
            <Grid item xs={6}>
                <Typography variant="h6" mb={5}>
                    {ownedBill ? 'Bills Owed' : 'Bills People owed You'}
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
                <Button
                    variant={'contained'}
                    sx={{ height: '80%', mr: 2 }}
                    onClick={goToNextPage}
                >
                    {ownedBill ? 'Bills People owed you' : 'Bills Owed'}
                </Button>
                <Button
                    variant={'contained'}
                    sx={{ height: '80%' }}
                    onClick={goToUploadPage}
                >
                    Upload
                </Button>
            </Grid>
        </Grid>
    )
}

const BillTitleBlock = block(BillTitle)
export default BillTitleBlock
