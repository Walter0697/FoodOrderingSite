'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Grid, Autocomplete, TextField, Button } from '@mui/material'

import { ImageCropPickerType } from '@/types/cropper'
import { SelectOptions } from '@/types/common'

import ImageCropPicker from '@/components/common/ImageCropPicker'

import toastHelper from '@/utils/toast'
import { dataURItoBlob } from '@/utils/image'

type BillUploadFormProps = {
    userList: SelectOptions[]
}

export default function BillUploadForm({ userList }: BillUploadFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const [selectedImageType, setSelectedImageType] =
        useState<ImageCropPickerType>(ImageCropPickerType.NotSelected)
    const [imageStore, setImageStore] = useState<File | string | null>(null)

    const [restaurant, setRestaurant] = useState<string>('')
    const [totalPrice, setTotalPrice] = useState<string>('0')
    const [notes, setNotes] = useState<string>('')
    const [targetUsers, setTargetUsers] = useState<SelectOptions[]>([])

    const setImage = (
        pickerType: ImageCropPickerType,
        image: File | string | null
    ) => {
        setSelectedImageType(pickerType)
        setImageStore(image)
    }

    const onSubmit = async () => {
        if (loading) return
        setLoading(true)
        try {
            let hasError = false
            if (
                !imageStore ||
                selectedImageType === ImageCropPickerType.NotSelected
            ) {
                toastHelper.error('Please select image')
                hasError = true
            }
            if (!restaurant) {
                toastHelper.error('Please enter restaurant')
                hasError = true
            }
            if (!totalPrice || totalPrice === '0') {
                toastHelper.error('Please enter total price')
                hasError = true
            } else {
                // check if it is two decimal places
                const regex = /^\d+(\.\d{1,2})?$/
                if (!regex.test(totalPrice)) {
                    toastHelper.error(
                        'Total price only accept two decimal places'
                    )
                    hasError = true
                }
            }
            if (!targetUsers.length) {
                toastHelper.error('Please select target user')
                hasError = true
            }

            if (hasError) {
                setLoading(false)
                return
            }

            const formData = new FormData()
            if (selectedImageType === ImageCropPickerType.Original) {
                formData.append('file', imageStore as File)
            } else if (selectedImageType === ImageCropPickerType.Cropped) {
                const blob = dataURItoBlob(imageStore as string)
                formData.append('file', blob, 'cropped.png')
            }

            formData.append('restaurant', restaurant)
            formData.append('totalPrice', totalPrice.toString())
            formData.append('notes', notes)
            for (let i = 0; i < targetUsers.length; i++) {
                formData.append('targetUsers', targetUsers[i].value as string)
            }

            const response = await fetch('/api/bill/upload', {
                method: 'POST',
                body: formData,
            })
            const result = await response.json()

            if (result.success) {
                toastHelper.success('Upload success')

                router.push('/bill/list')
            } else {
                toastHelper.error(result.message)
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
        <Grid
            container
            spacing={1}
            sx={{
                p: 1,
                maxHeight: '80vh',
                overflowY: 'auto',
            }}
        >
            <Grid item xs={12} mb={2}>
                <ImageCropPicker
                    selected={selectedImageType}
                    onChange={setImage}
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={6} lg={6} mb={2}>
                <TextField
                    label={'Restaurant'}
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    variant={'outlined'}
                    fullWidth
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={6} lg={6} mb={2}>
                <TextField
                    label={'Total Price'}
                    value={totalPrice}
                    onChange={(e) => {
                        const value = e.target.value
                        setTotalPrice(value)
                    }}
                    variant={'outlined'}
                    fullWidth
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={12} lg={12} mb={2}>
                <Autocomplete
                    multiple={true}
                    value={targetUsers}
                    onChange={(event, newValue) => {
                        setTargetUsers(newValue)
                    }}
                    options={userList}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={'Target User'}
                            variant={'outlined'}
                            fullWidth
                            disabled={loading}
                        />
                    )}
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={12} lg={12} mb={2}>
                <TextField
                    label={'Notes'}
                    rows={5}
                    multiline
                    value={notes}
                    onChange={(e) => {
                        setNotes(e.target.value)
                    }}
                    variant={'outlined'}
                    fullWidth
                    disabled={loading}
                />
            </Grid>

            <Grid item xs={12} md={12} lg={12} mb={2}>
                <Button
                    onClick={onSubmit}
                    variant={'contained'}
                    fullWidth
                    disabled={loading}
                >
                    Submit
                </Button>
            </Grid>
        </Grid>
    )
}
