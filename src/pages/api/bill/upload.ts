import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'

import billService from '@/services/bill'
import userService from '@/services/user'
import { userMiddleware } from '@/middlewares/user'

import { saveImageIntoStorage } from '@/utils/image'
import discordHelper from '@/services/discord'

async function parseFormData(
    req: NextApiRequest & { files?: any },
    res: NextApiResponse
) {
    const storage = multer.memoryStorage()
    const multerUpload = multer({ storage })
    const multerFiles = multerUpload.any()
    await new Promise((resolve, reject) => {
        multerFiles(req as any, res as any, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
    return {
        fields: req.body,
        files: req.files,
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}

type UploadRequestBody = {
    restaurant: string
    totalPrice: number
    notes: string
    targetUsers: string[] | string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const result = await parseFormData(req, res)
            const body: UploadRequestBody = result.fields

            const filename = await saveImageIntoStorage(result.files[0])
            const targetUsers: number[] =
                typeof body.targetUsers === 'string'
                    ? [parseInt(body.targetUsers)]
                    : body.targetUsers.map((s) => parseInt(s))
            const bill = await billService.createBill(
                {
                    restaurant: body.restaurant,
                    photoUrl: filename,
                    notes: body.notes,
                    totalPrice: body.totalPrice,
                    targetUsers: targetUsers,
                },
                user.id
            )

            const targetUserList = await userService.getUserByIdList(
                targetUsers
            )
            discordHelper.alertUserWhenUploadedBill(targetUserList, bill, user)

            res.status(200).json({
                success: true,
            })
        }
        default: {
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${requestMethod} Not Allowed`)
        }
    }
}
