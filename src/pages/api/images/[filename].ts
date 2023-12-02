import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'GET': {
            const { filename } = req.query
            const currentPath = `./public/uploads/${filename}`

            if (fs.existsSync(currentPath)) {
                const img = fs.readFileSync(currentPath, { encoding: 'base64' })
                res.status(200).json({ img })
            }
            res.status(404)
        }
        default: {
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
