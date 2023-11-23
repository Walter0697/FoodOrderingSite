import React from 'react'
import { Stack, IconButton, TextField } from '@mui/material'

import { FaMinus, FaPlus } from 'react-icons/fa'

type CountBoxProps = {
    value: number
    onChange: (value: number) => void
    readOnly?: boolean
    minimumNumber: number
    maximumNumber: number
}

function CountBox({
    value,
    onChange,
    readOnly,
    minimumNumber,
    maximumNumber,
}: CountBoxProps) {
    const onClickPlus = () => {
        if (readOnly) return

        if (value >= maximumNumber) return

        if (isNaN(value)) {
            onChange(0)
            return
        }

        onChange(value + 1)
    }

    const onClickMinus = () => {
        if (readOnly) return

        if (value <= minimumNumber) return

        if (isNaN(value)) {
            onChange(0)
            return
        }

        onChange(value - 1)
    }

    const isMinusDisabled = () => {
        if (readOnly) return true

        if (value <= minimumNumber) return true

        return false
    }

    const isAddDisabled = () => {
        if (readOnly) return true

        if (value >= maximumNumber) return true

        return false
    }

    const addDisabled = isAddDisabled()
    const minusDisabled = isMinusDisabled()

    return (
        <>
            <Stack display={'flex'} justifyContent={'center'} spacing={2}>
                <Stack
                    direction={'row'}
                    spacing={2}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <IconButton
                        sx={{
                            backgroundColor: 'red',
                            ':hover': {
                                backgroundColor: 'red',
                            },
                            color: 'white',
                            width: '50px',
                            height: '50px',
                        }}
                        onClick={() => onClickMinus()}
                        disabled={minusDisabled}
                    >
                        <FaMinus />
                    </IconButton>
                    <TextField
                        sx={{
                            width: '100px',
                            height: '50px',
                            color: readOnly ? 'gray' : 'black',
                            border: `3px solid ${readOnly ? 'gray' : 'black'}`,
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                        }}
                        value={value}
                        onChange={(e) => {
                            // can only input integer
                            if (isNaN(parseInt(e.target.value))) return
                            const final = parseInt(e.target.value)
                            if (final > maximumNumber) return
                            if (final < minimumNumber) return
                            onChange(final)
                        }}
                        disabled={readOnly}
                    />
                    <IconButton
                        sx={{
                            backgroundColor: 'blue',
                            ':hover': {
                                backgroundColor: 'blue',
                            },
                            color: 'white',
                            width: '50px',
                            height: '50px',
                        }}
                        disabled={addDisabled}
                        onClick={() => onClickPlus()}
                    >
                        <FaPlus />
                    </IconButton>
                </Stack>
            </Stack>
        </>
    )
}

export default CountBox
