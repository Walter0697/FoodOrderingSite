'use client'

import { FormEvent, useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Grid,
    Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import toastHelper from '@/utils/toast'
import PasswordField from '@/components/common/PasswordField'
import FirstLoginDialog from '@/components/login/FirstLoginDialog'

const Login = () => {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [firstLoginDialog, setFirstLoginDialog] = useState(false)

    const canLogin = !!username && !!password

    const onLoginHandler = async (
        e: FormEvent<HTMLFormElement> | undefined
    ) => {
        e && e.preventDefault()
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            })
            const result = await response.json()

            if (!result.valid) {
                toastHelper.error('Invalid username or password')
                return
            }

            if (result.valid) {
                if (result.firstLogin) {
                    setFirstLoginDialog(true)
                    return
                } else {
                    toastHelper.success('Login successful')
                    router.push('/ordering/account')
                    return
                }
            }
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        }
    }

    const clearField = () => {
        setUsername('')
        setPassword('')
        setFirstLoginDialog(false)
    }

    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                bgcolor={'gray'}
                height={'100vh'}
            >
                <form onSubmit={onLoginHandler}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant={'h5'} mb={3} p={1}>
                                        Login to Food Ordering
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className={'username'}
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        label={'Username'}
                                        variant={'outlined'}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <PasswordField
                                        className={'password'}
                                        value={password}
                                        onChange={(v) => setPassword(v)}
                                        label={'Password'}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button
                                id={'loginBtn'}
                                variant={'contained'}
                                fullWidth
                                type={'submit'}
                                disabled={!canLogin}
                            >
                                Login
                            </Button>
                        </CardActions>
                    </Card>
                </form>
            </Box>
            <FirstLoginDialog
                open={firstLoginDialog}
                username={username}
                onSuccessHandler={() => clearField()}
                handleClose={() => setFirstLoginDialog(false)}
            />
        </>
    )
}

export default Login
