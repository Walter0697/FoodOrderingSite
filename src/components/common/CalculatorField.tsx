'use client'

import { TextField } from '@mui/material'
import { useEffect } from 'react'
import { evaluate } from 'mathjs'

type CalculatorFieldProps = {
    value: string
    onChange: (value: string) => void
    label?: string
    type?: string
    fullWidth?: boolean
    disabled?: boolean
    required?: boolean
    error?: boolean
    helperText?: string
    placeholder?: string
    className?: string
    variant?: 'standard' | 'filled' | 'outlined'
}

const calculateTime = 2000

const CalculatorField = ({
    value,
    onChange,
    ...props
}: CalculatorFieldProps) => {
    const calculateExpression = (expression: string): string => {
        try {
            const result = evaluate(expression)
            if (!result) {
                return expression
            }
            return result.toString()
        } catch (err: unknown) {
            return expression
        }
    }

    const calculateAndSetCalculateExpression = (expression: string) => {
        const result = calculateExpression(expression)
        if (result === expression) {
            return
        }
        onChange(result)
    }

    useEffect(() => {
        if (!value) {
            return
        }
        const answer = calculateExpression(value)
        if (answer === value) {
            return
        }

        const previousValue = value
        const timer = setTimeout(() => {
            calculateAndSetCalculateExpression(previousValue)
        }, calculateTime) // give seconds to type before auto calculating
        return () => clearTimeout(timer)
    }, [value])

    return (
        <TextField
            value={value}
            onChange={(e) => {
                onChange(e.target.value)
            }}
            {...props}
        />
    )
}

export default CalculatorField
