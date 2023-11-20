import React from 'react'
import { Button, Stack, Grid } from '@mui/material'

import { OrderingType } from '@/types/enum'

import { FaBowlFood } from 'react-icons/fa6'
import { MdLocalDrink } from 'react-icons/md'

type OrderingTypeChoiceProps = {
    value: OrderingType
    onChange: (value: OrderingType) => void
    readOnly?: boolean
}

function OrderingTypeChoice({
    value,
    onChange,
    readOnly,
}: OrderingTypeChoiceProps) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Button
                    startIcon={<FaBowlFood />}
                    variant={
                        value === OrderingType.Food ? 'contained' : 'outlined'
                    }
                    onClick={() => onChange(OrderingType.Food)}
                    disabled={readOnly}
                    fullWidth
                >
                    Food
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    startIcon={<MdLocalDrink />}
                    variant={
                        value === OrderingType.Drink ? 'contained' : 'outlined'
                    }
                    onClick={() => onChange(OrderingType.Drink)}
                    disabled={readOnly}
                    fullWidth
                >
                    Drink
                </Button>
            </Grid>
        </Grid>
    )
}

export default OrderingTypeChoice
