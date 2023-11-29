'use client'

import { Typography, Grid, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

import { block } from 'million/react'

function BillTitle() {
    const router = useRouter()

    const goToUploadPage = () => {
        router.push('/bill/upload')
    }

    return (
        <Grid container spacing={0} pb={2}>
            <Grid item xs={6}>
                <Typography variant="h6" mb={5}>
                    Bills Owed
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
