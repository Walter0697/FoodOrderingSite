'use client'

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { Grid, Button, Stack } from '@mui/material'

import { ImageCropPickerType } from '@/types/cropper'

import Cropper from 'react-perspective-cropper'
const CropperWrap = Cropper as React.ElementType

type ImageCropPickerProps = {
    selected: ImageCropPickerType
    onChange: (
        pickerType: ImageCropPickerType,
        image: string | File | null
    ) => void
}

type CropperDoneOptionType = {
    preview: boolean
}

type CropperRefType = {
    done: (options?: CropperDoneOptionType) => Promise<void>
    backToCrop: () => Promise<void>
}

export default function ImageCropPicker({
    selected,
    onChange,
}: ImageCropPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [currentContainerWidth, setCurrentContainerWdith] =
        useState<number>(0)

    const cachedImageURI = useRef<string | null>(null)

    const [cropped, setCropped] = useState<boolean>(false)
    const [cropState, setCropState] = useState()
    const [currentImage, setImage] = useState<null | File>(null)
    const cropperRef = useRef()

    const onDragStop = useCallback((s: any) => setCropState(s), [])
    const onImageChange = useCallback((s: any) => setCropState(s), [])

    const getContainerWidth = () => {
        if (!containerRef.current) return
        setCurrentContainerWdith(
            containerRef.current.getBoundingClientRect().width
        )
    }

    useEffect(() => {
        getContainerWidth()
        window.addEventListener('resize', getContainerWidth)
        return () => {
            window.removeEventListener('resize', getContainerWidth)
        }
    }, [containerRef.current])

    const imageWidth = useMemo(() => {
        if (!currentContainerWidth) return 0
        if (currentContainerWidth > 992) {
            // 992 is md size
            return currentContainerWidth * 0.4
        }
        return currentContainerWidth * 0.8
    }, [currentContainerWidth])

    const imagePreview = useMemo(() => {
        if (!currentImage) return null
        const url = URL.createObjectURL(currentImage)
        return url
    }, [currentImage])

    const cropImage = async () => {
        try {
            if (!cropperRef.current) return
            const cropper: CropperRefType = cropperRef.current
            await cropper.done({
                preview: true,
            })
            setCropped(true)
        } catch (err) {
            console.log(err)
        }
    }

    const revert = async () => {
        try {
            if (!cropperRef.current) return
            const cropper: CropperRefType = cropperRef.current
            await cropper.backToCrop()
            setCropped(false)

            if (selected === ImageCropPickerType.Cropped) {
                onChange(ImageCropPickerType.NotSelected, null)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onCropperButtonClick = () => {
        if (cropped) {
            revert()
            return
        }
        cropImage()
    }

    const onImgSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (cropped) {
                revert()
                setCropped(false)
                cachedImageURI.current = null
                onChange(ImageCropPickerType.NotSelected, null)
            }
            setImage(e.target.files[0])
        }
    }

    const generateURIFromCanvas = () => {
        if (cachedImageURI.current) {
            return cachedImageURI.current
        }
        const canvas = document.getElementsByTagName('canvas')[0]
        if (!canvas) return
        const imageURI = canvas.toDataURL('image/png')
        cachedImageURI.current = imageURI
        return imageURI
    }

    const onOriginalSelect = () => {
        onChange(ImageCropPickerType.Original, currentImage)
    }

    const onCroppedSelect = async () => {
        const imageURI = generateURIFromCanvas()
        if (imageURI) {
            onChange(ImageCropPickerType.Cropped, imageURI)
        }
    }

    return (
        <Grid container spacing={1} ref={containerRef}>
            <Grid
                item
                xs={12}
                md={6}
                lg={6}
                display={'flex'}
                justifyContent={'center'}
                p={1}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        p: 1,
                        border:
                            selected === ImageCropPickerType.Original
                                ? '3px solid red'
                                : '1px solid black',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            width={imageWidth}
                            height={'auto'}
                        />
                    )}
                    <input
                        type="file"
                        id="upload-image"
                        style={{ display: 'none' }}
                        onChange={onImgSelect}
                    />
                    <label htmlFor="upload-image">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{
                                mt: 2,
                            }}
                        >
                            Upload Image
                        </Button>
                    </label>
                </Stack>
            </Grid>
            <Grid
                item
                xs={12}
                md={6}
                lg={6}
                display={'flex'}
                justifyContent={'center'}
                p={1}
            >
                <Stack
                    direction={'column'}
                    sx={{
                        p: 1,
                        border:
                            selected === ImageCropPickerType.Cropped
                                ? '3px solid red'
                                : '1px solid black',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <CropperWrap
                        ref={cropperRef}
                        image={currentImage}
                        maxWidth={imageWidth}
                        maxHeight={imageWidth}
                        onChange={onImageChange}
                        onDragStop={onDragStop}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                        }}
                        onClick={onCropperButtonClick}
                    >
                        {cropped ? 'Revert' : 'Crop!'}
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <Button
                    variant={'contained'}
                    fullWidth
                    onClick={() => onOriginalSelect()}
                    disabled={selected === ImageCropPickerType.Original}
                >
                    Select Original
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    variant={'contained'}
                    fullWidth
                    onClick={() => onCroppedSelect()}
                    disabled={
                        !cropped || selected === ImageCropPickerType.Cropped
                    }
                >
                    Select Cropped
                </Button>
            </Grid>
        </Grid>
    )
}
