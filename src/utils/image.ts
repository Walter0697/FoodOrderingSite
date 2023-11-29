import dayjs from 'dayjs'
import fs from 'fs'

type FileType = {
    buffer: Buffer
    originalname: string
}

export const saveImageIntoStorage = async (file: FileType): Promise<string> => {
    const buffer = Buffer.from(file.buffer)
    const date = dayjs().format('YYYYMMDDHHmmss')
    const ext = file.originalname.split('.').pop()
    const filename = `${date}.${ext}`
    await fs.createWriteStream(`./public/uploads/${filename}`).write(buffer)
    return filename
}

export const dataURItoBlob = (dataURI: string) => {
    let byteString: string
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1])
    else byteString = unescape(dataURI.split(',')[1])

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })
}
