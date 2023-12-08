import { Bill, User } from '@prisma/client'
import { generateBillSecret } from '@/utils/auth'
import axios from 'axios'

type BillUploadInfoUserItem = {
    isDiscord: boolean
    username: string
    token: string
}

type BillUploadInfo = {
    restaurant: string
    users: BillUploadInfoUserItem[]
    uploadUser: string
}

const alertUserWhenUploadedBill = async (
    user: User[],
    bill: Bill,
    uploadUser: User
) => {
    console.time(`Sending alert for bill ${bill.id}`)

    const discordUploadBillUrl = process.env.DISCORD_URL + '/api/bill_uploaded'

    const items: BillUploadInfoUserItem[] = []
    for (const u of user) {
        const token = await generateBillSecret(u.id, bill.id)
        const encoded = encodeURIComponent(token).replace(/\./g, '%2E')
        if (u.discordUsername) {
            items.push({
                isDiscord: true,
                username: u.discordUsername,
                token: encoded,
            })
        } else {
            items.push({
                isDiscord: false,
                username: u.username,
                token: encoded,
            })
        }
    }

    const postBody: BillUploadInfo = {
        restaurant: bill.restaurantName,
        users: items,
        uploadUser: uploadUser.displayname,
    }

    const result = await axios.request({
        method: 'POST',
        url: discordUploadBillUrl,
        data: postBody,
    })

    if (result.status !== 200) {
        console.log('Cannot send bill uploaded alert to discord')
        return
    }

    console.time(`Sent alert for bill ${bill.id}`)
}

type BillCompleteInfo = {
    restaurant: string
    uploadUsername: string
}

const alertUserWhenBillCompleted = async (uploadUser: User, bill: Bill) => {
    console.time(`Sending complete alert for bill ${bill.id}`)

    const discordCompleteBillUrl =
        process.env.DISCORD_URL + '/api/bill_complete'

    const postBody: BillCompleteInfo = {
        restaurant: bill.restaurantName,
        uploadUsername: uploadUser.discordUsername ?? '',
    }

    const result = await axios.request({
        method: 'POST',
        url: discordCompleteBillUrl,
        data: postBody,
    })

    if (result.status !== 200) {
        console.log('Cannot send bill complete alert to discord')
        return
    }

    console.time(`Sent complete alert for bill ${bill.id}`)
}

const discordHelper = {
    alertUserWhenUploadedBill,
    alertUserWhenBillCompleted,
}

export default discordHelper
