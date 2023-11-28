'use client'

import React, { useState } from 'react'
import { Grid, Autocomplete, TextField } from '@mui/material'

import { ImageCropPickerType } from '@/types/cropper'
import { SelectOptions } from '@/types/common'

import ImageCropPicker from '@/components/common/ImageCropPicker'

type BillUploadFormProps = {
    userList: SelectOptions[]
}

export default function BillUploadForm({ userList }: BillUploadFormProps) {
    const [selectedImageType, setSelectedImageType] =
        useState<ImageCropPickerType>(ImageCropPickerType.NotSelected)
    const [imageStore, setImageStore] = useState<File | string | null>(null)

    const [restaurant, setRestaurant] = useState<string>('')
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [notes, setNotes] = useState<string>('')
    const [targetUsers, setTargetUsers] = useState<SelectOptions[]>([])

    const setImage = (
        pickerType: ImageCropPickerType,
        image: File | string | null
    ) => {
        setSelectedImageType(pickerType)
        setImageStore(image)
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
                />
            </Grid>

            <Grid item xs={12} md={6} lg={6} mb={2}>
                <TextField
                    label={'Restaurant'}
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    variant={'outlined'}
                    fullWidth
                />
            </Grid>

            <Grid item xs={12} md={6} lg={6} mb={2}>
                <TextField
                    label={'Total Price'}
                    value={totalPrice}
                    onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                            setTotalPrice(parseInt(value))
                        } else {
                            setTotalPrice(0)
                        }
                    }}
                    variant={'outlined'}
                    fullWidth
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
                        />
                    )}
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
                />
            </Grid>
        </Grid>
    )
}
