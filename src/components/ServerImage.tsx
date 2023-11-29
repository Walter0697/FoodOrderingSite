'use client'

import { useState, useEffect, useMemo } from 'react'

type ServerImageProps = {
    src: string
}

function ServerImage({ src }: ServerImageProps) {
    const [image, setImage] = useState<string | null>(null)

    const fetchImage = async () => {
        const res = await fetch(`/api/images/${src}`)
        const data = await res.json()
        const img = data.img
        setImage(img)
    }

    const extension = useMemo(() => {
        if (!src) return 'png'
        const splitted = src.split('.')
        const ext = splitted[splitted.length - 1]
        return ext
    }, [src])

    useEffect(() => {
        if (src) {
            fetchImage()
        }
    }, [src])

    return (
        <>
            {image && (
                <img
                    src={`data:image/${extension};base64,${image}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                    }}
                />
            )}
        </>
    )
}

export default ServerImage
