'use client'

import { Box, Grid } from '@mui/material'

import { OrderingListItem } from '@/types/display/ordering'
import { OrderingType } from '@/types/enum'

import { ConstantValue } from '@/utils/constant'

import { FaBowlFood } from 'react-icons/fa6'
import { MdLocalDrink } from 'react-icons/md'
import { IoIosPricetags } from 'react-icons/io'
import { FaBalanceScale, FaMoneyBillWave } from 'react-icons/fa'

import { block } from 'million/react'

type TotalPriceSummaryProps = {
    itemList: OrderingListItem[]
    actualPrice?: number | null | undefined
}

function TotalPriceSummary({ itemList, actualPrice }: TotalPriceSummaryProps) {
    const foodList = itemList.filter((s) => s.type === OrderingType.Food)
    const drinkList = itemList.filter((s) => s.type === OrderingType.Drink)
    const foodCount = foodList.length
    const drinkCount = drinkList.length
    const totalCount = foodCount + drinkCount
    const foodTotal = foodList.reduce(
        (acc, cur) => acc + cur.unitPrice * cur.quantity,
        0
    )
    const drinkTotal = drinkList.reduce(
        (acc, cur) => acc + cur.unitPrice * cur.quantity,
        0
    )
    const total = foodTotal + drinkTotal
    const balanceLeft = ConstantValue.TotalBudget - total

    return (
        <Grid container spacing={1}>
            <Grid
                item
                xs={12}
                pt={2}
                display={'flex'}
                justifyContent={'flex-end'}
            >
                <Box
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#ffeababf',
                        color: 'black',
                        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                        height: 'auto',
                        width: '400px',
                    }}
                >
                    <Grid container spacing={1} p={2}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: '1px solid gray',
                            }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                    <FaBowlFood /> Food Total:{' '}
                                </Grid>
                                <Grid item xs={3}>
                                    {foodCount} Item(s)
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                >
                                    $ {foodTotal}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: '1px solid gray',
                            }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                    <MdLocalDrink /> Drink Total:{' '}
                                </Grid>
                                <Grid item xs={3}>
                                    {drinkCount} Item(s)
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                >
                                    $ {drinkTotal}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: '1px solid gray',
                            }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                    <IoIosPricetags /> Total:{' '}
                                </Grid>
                                <Grid item xs={3}>
                                    {totalCount} Item(s)
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                    sx={{
                                        textDecoration:
                                            actualPrice !== undefined &&
                                            actualPrice !== null &&
                                            actualPrice !== total
                                                ? 'line-through'
                                                : 'none',
                                    }}
                                >
                                    $ {total}
                                </Grid>
                            </Grid>
                        </Grid>
                        {actualPrice !== undefined &&
                            actualPrice !== null &&
                            actualPrice !== total && (
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        borderBottom: '1px solid gray',
                                    }}
                                >
                                    <Grid container spacing={0}>
                                        <Grid item xs={6}>
                                            <FaMoneyBillWave /> Actual Price:{' '}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            display={'flex'}
                                            justifyContent={'flex-end'}
                                        >
                                            $ {actualPrice}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                        <Grid
                            item
                            xs={12}
                            sx={{
                                borderBottom: '1px solid gray',
                            }}
                        >
                            <Grid container spacing={0}>
                                <Grid item xs={6}>
                                    <FaBalanceScale /> Balance:{' '}
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                    sx={{
                                        color:
                                            balanceLeft < 0 ? 'red' : 'green',
                                    }}
                                >
                                    $ {balanceLeft}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}

const TotalPriceSummaryBlock = block(TotalPriceSummary)
export default TotalPriceSummaryBlock
