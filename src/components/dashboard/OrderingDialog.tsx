'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import BaseForm from '@/components/common/BaseDialog'
import CountBox from '@/components/common/CountBox'
import OrderingTypeChoice from '@/components/common/OrderingTypeChoice'

import { Typography, Grid, TextField, Stack, Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { ScraperProductType } from '@/types/scraper'
import { OrderingType } from '@/types/enum'

import { checkURLValid } from '@/utils/orders'
import { StaticPath } from '@/utils/constant'
import toastHelper from '@/utils/toast'

type OrderingDialogProps = {
    open: boolean
    selectedMonth: string
    onItemCreatedHandler: () => void
    handleClose: () => void
}

function OrderingDialog({
    open,
    selectedMonth,
    onItemCreatedHandler,
    handleClose,
}: OrderingDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const [link, setLink] = useState<string>('')
    const [productData, setProductData] = useState<ScraperProductType | null>(
        null
    )
    const [productType, setProductType] = useState<OrderingType>(
        OrderingType.Food
    )
    const [unit, setUnit] = useState<number>(1)
    const totalPrice = productData ? productData.productPrice * unit : 0

    useEffect(() => {
        setProductData(null)
        setLink('')
        setUnit(1)
    }, [])

    const onFetchHandler = async () => {
        setLoading(true)

        try {
            const trimmedLink = link.trim()
            if (!trimmedLink) {
                setLoading(false)
                return
            }
            if (!checkURLValid(trimmedLink)) {
                toastHelper.error('Invalid URL')
                setLoading(false)
                return
            }

            setProductData(null)

            const response = await fetch('/api/product/search', {
                method: 'POST',
                body: JSON.stringify({ url: trimmedLink }),
            })
            if (response.status === 401) {
                router.push(StaticPath.HomePage)
            }
            const result = await response.json()

            if (!result.success) {
                toastHelper.error(result.message)
            }

            const data = result.data as ScraperProductType
            setProductData(data)
            setUnit(1)
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (overrideQuantity: boolean) => {
        if (!productData) {
            return
        }

        setLoading(true)
        try {
            const postBody = {
                productId: productData?.productId,
                quantity: unit,
                price: productData?.productPrice,
                overrideQuantity: overrideQuantity,
                category: productType,
                selectedMonth: selectedMonth,
            }

            const response = await fetch('/api/ordering/cart', {
                method: 'POST',
                body: JSON.stringify(postBody),
            })
            if (response.status !== 200) {
                toastHelper.error('Failed to add item')
                setLoading(false)
                return
            }

            const result = await response.json()
            if (!result.success) {
                if (result.showConfirm) {
                    const confirmed = window.confirm(result.message)
                    if (confirmed) {
                        // if user said yes, they want to override quantity
                        onSubmitHandler(true)
                    }
                    return
                }
                toastHelper.error('Failed to add item')
                setLoading(false)
                return
            }

            toastHelper.success('Item added')
            onItemCreatedHandler()
            handleClose()
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                toastHelper.error(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <BaseForm
            open={open}
            loading={loading}
            title={'Searching Products...'}
            onSubmitHandler={() => onSubmitHandler(false)}
            handleClose={handleClose}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <Typography variant="h6">
                        Please input the link here:
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={11}>
                            <TextField
                                disabled={loading}
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid
                            item
                            xs={1}
                            sx={{
                                height: '100%',
                            }}
                        >
                            <LoadingButton
                                variant={'contained'}
                                onClick={onFetchHandler}
                                loading={loading}
                                sx={{ height: '52px' }}
                                fullWidth
                            >
                                Fetch
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
                {productData && (
                    <Grid item xs={12} mt={3}>
                        <Grid container spacing={0}>
                            <Grid
                                item
                                xs={7}
                                sx={{ border: '1px solid gray' }}
                                p={2}
                            >
                                <Typography variant={'h5'}>
                                    Product Name:
                                </Typography>
                                <Typography variant={'h5'} mb={3}>
                                    <b style={{ color: 'purple' }}>
                                        {productData.productName}
                                    </b>
                                </Typography>
                                <Typography variant={'h5'}>
                                    Unit Price:{' '}
                                    <b style={{ color: 'blue' }}>
                                        HKD ${productData.productPrice}
                                    </b>
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={5}
                                p={2}
                                display={'flex'}
                                justifyContent={'flex-end'}
                                alignItems={'flex-end'}
                                sx={{
                                    borderWidth: '1 1 1 0',
                                    borderStyle: 'solid',
                                    borderColor: 'gray',
                                }}
                            >
                                <Stack
                                    mt={2}
                                    display={'flex'}
                                    justifyContent={'flex-end'}
                                    alignItems={'flex-end'}
                                >
                                    <Box mb={4}>
                                        <OrderingTypeChoice
                                            value={productType}
                                            onChange={(value) =>
                                                setProductType(value)
                                            }
                                            readOnly={loading}
                                        />
                                    </Box>
                                    <CountBox
                                        value={unit}
                                        onChange={(value) => setUnit(value)}
                                        readOnly={loading}
                                        minimumNumber={1}
                                        maximumNumber={99}
                                    />
                                    <Typography variant={'h6'} pt={2}>
                                        Total Price:{' '}
                                        <b style={{ color: 'blue' }}>
                                            HKD {totalPrice}
                                        </b>
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </BaseForm>
    )
}

export default OrderingDialog
