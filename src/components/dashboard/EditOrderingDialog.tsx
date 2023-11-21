'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import BaseForm from '@/components/common/BaseDialog'
import CountBox from '@/components/common/CountBox'
import OrderingTypeChoice from '@/components/common/OrderingTypeChoice'

import { Typography, Grid, Stack, Box } from '@mui/material'

import { OrderingType, SocketActionType } from '@/types/enum'
import { OrderingListItem } from '@/types/display/ordering'
import { SocketActionData } from '@/types/socket'

import toastHelper from '@/utils/toast'

type EditOrderingDialogProps = {
    open: boolean
    item?: OrderingListItem
    selectedMonth: string
    onItemEditedHandler: (item: Partial<SocketActionData>) => void
    handleClose: () => void
}

function EditOrderingDialog({
    open,
    selectedMonth,
    item,
    onItemEditedHandler,
    handleClose,
}: EditOrderingDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const [productType, setProductType] = useState<OrderingType>(
        OrderingType.Food
    )
    const [unit, setUnit] = useState<number>(1)
    const totalPrice = item ? item.totalPrice * unit : 0

    useEffect(() => {
        setProductType(item?.type || OrderingType.Food)
        setUnit(item?.quantity || 1)
        setLoading(false)
    }, [open, item])

    const onSubmitHandler = async () => {
        const postBody = {
            category: productType,
            quantity: unit,
        }
        setLoading(true)
        try {
            const res = await fetch(`/api/ordering/item/${item?.id}`, {
                method: 'PATCH',
                body: JSON.stringify(postBody),
            })
            const data = await res.json()
            if (data.success) {
                toastHelper.success('Item Edited')
                onItemEditedHandler({
                    actionType: SocketActionType.Update,
                    productName: item?.productName,
                    productIdentifier: item?.productIdentifier,
                    quantity: unit,
                    unitPrice: item?.unitPrice,
                    selectedMonth: selectedMonth,
                    orderId: item?.id,
                    type: productType,
                })
                handleClose()
            } else {
                toastHelper.error(data.message)
            }
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
            onSubmitHandler={onSubmitHandler}
            handleClose={handleClose}
        >
            <Grid container spacing={1}>
                <Grid
                    item
                    xs={12}
                    display={'flex'}
                    justifyContent={'flex-start'}
                >
                    <Typography variant="h6">
                        Edit {item?.productName}
                    </Typography>
                </Grid>
                {item && (
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
                                        {item.productName}
                                    </b>
                                </Typography>
                                <Typography variant={'h5'}>
                                    Unit Price:{' '}
                                    <b style={{ color: 'blue' }}>
                                        HKD ${item.unitPrice}
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

export default EditOrderingDialog
