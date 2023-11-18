import React, { useState } from 'react'
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
} from '@mui/material'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

type PasswordFieldProps = {
    label: string
    value: string
    className?: string
    disabled?: boolean
    onChange: (value: string) => void
}

function PasswordField({
    label,
    value,
    className,
    disabled,
    onChange,
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false)

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
                {label}
            </InputLabel>
            <OutlinedInput
                className={className}
                id="outlined-adornment-password"
                type={visible ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setVisible(!visible)}
                            edge="end"
                        >
                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </IconButton>
                    </InputAdornment>
                }
                disabled={disabled}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                label={label}
            />
        </FormControl>
    )
}

export default PasswordField
