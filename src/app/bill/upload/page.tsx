import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Box, Grid, Typography } from '@mui/material'
import BillUploadForm from '@/components/bill/BillUploadForm'

import { SelectOptions } from '@/types/common'

import { ServerConfiguration, StaticPath } from '@/utils/constant'
import { isAuthorized } from '@/utils/auth'

import userService from '@/services/user'

const getUserList = async (): Promise<SelectOptions[]> => {
    const nextCookies = cookies()

    const token = nextCookies.get(ServerConfiguration.SessionKeyName)
    if (!token || !token.value) {
        redirect(StaticPath.HomePage)
    }

    const user = await isAuthorized(token.value, false)
    if (!user) {
        redirect(StaticPath.HomePage)
    }

    const users = await userService.getAllUsers()
    const options: SelectOptions[] = users
        .map((user) => {
            const output: SelectOptions = {
                value: user.id,
                label: user.displayname,
            }
            return output
        })
        .filter((s) => s.value !== user.id) // removing myself

    return options
}

export default async function BillUpload() {
    const users = await getUserList()

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4" mb={2}>
                        Upload Bill
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <BillUploadForm userList={users} />
                </Grid>
            </Grid>
        </Box>
    )
}
