import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { filename } = req.query
    const currentPath = `./public/uploads/${filename}`

    if (fs.existsSync(currentPath)) {
        const img = fs.readFileSync(currentPath, { encoding: 'base64' })
        res.status(200).json({ img })
    }
    res.status(404)
}
