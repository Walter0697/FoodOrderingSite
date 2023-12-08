import { extractBillSecret } from '@/utils/auth'

import billService from '@/services/bill'
import billPaidRecordService from '@/services/billPaidRecord'
import userService from '@/services/user'

import PayError from '@/components/pay/PayError'
import PayForm from '@/components/pay/PayForm'

import { BillPaymentInfo } from '@/types/dto/pay'
import dayjs from 'dayjs'

const wrongURLErrorMessage = [
    `Maybe you clicked on this link too late, much later than Harry's wakeup time.`,
    `I cannot find the bill you are looking for here, it is much harder to find than Micky's hair.`,
    `This message is not a bug, if you want to see bugs, you should visit OTNR.`,
    `I know this website is not perfect, you can't expect me to create something like Barry's PAA, right?`,
    `Why are you even here? Playing CTF, Louis?`,
    `If you are reading this error message, you are the one with no life.`,
]

async function getBillInfo(token: string): Promise<BillPaymentInfo> {
    const decoded = decodeURIComponent(token)
    const billSecret = await extractBillSecret(decoded)

    if (!billSecret) {
        const randomIndex = Math.floor(
            Math.random() * wrongURLErrorMessage.length
        )
        const randomMessage = wrongURLErrorMessage[randomIndex]
        return {
            success: false,
            title: 'Wrong URL',
            description: 'The URL might be expired or invalid.',
            joke: randomMessage,
        }
    }

    const bill = await billService.getBillById(billSecret.billId)
    if (!bill) {
        const randomIndex = Math.floor(
            Math.random() * wrongURLErrorMessage.length
        )
        const randomMessage = wrongURLErrorMessage[randomIndex]
        return {
            success: false,
            title: 'Cannot find Bill',
            description:
                'The token is valid, but the bill is not found, seems like a security leak(?)',
            joke: randomMessage,
        }
    }

    const user = await userService.getUserById(billSecret.userId)
    if (!user) {
        const randomIndex = Math.floor(
            Math.random() * wrongURLErrorMessage.length
        )
        const randomMessage = wrongURLErrorMessage[randomIndex]
        return {
            success: false,
            title: 'Cannot find User',
            description:
                'The token is valid, but the user is not found, seems like a security leak(?)',
            joke: randomMessage,
        }
    }

    const billUser = await userService.getUserById(bill.createdBy)

    const billPaidRecord =
        await billPaidRecordService.getBillPaidRecordByBillId(billSecret.billId)

    const result: BillPaymentInfo = {
        success: true,
        restaurantName: bill.restaurantName,
        photoUrl: bill.photoUrl,
        notes: bill.notes ?? '',
        uploadUser: billUser ? billUser.displayname : 'Unknown', // unknown should not happen
        displayName: user.displayname,
    }
    const userPaidRecord = billPaidRecord.find((s) => s.createdBy === user.id)

    if (userPaidRecord) {
        result.paidAmount = userPaidRecord.Amount
            ? userPaidRecord.Amount.toNumber()
            : 0
        result.paidTime = userPaidRecord.createdAt
            ? dayjs(userPaidRecord.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : 'Unknown'
        result.paidNotes = userPaidRecord.notes ?? ''
    }

    return result
}

const PayPage = async ({ params }: { params: { token: string } }) => {
    const billInfo = await getBillInfo(params.token)

    if (!billInfo.success) {
        return (
            <PayError
                title={billInfo.title}
                description={billInfo.description}
                joke={billInfo.joke}
            />
        )
    }

    return (
        <PayForm
            token={params.token}
            restaurantName={billInfo.restaurantName}
            photoUrl={billInfo.photoUrl}
            notes={billInfo.notes}
            uploadUser={billInfo.uploadUser}
            displayName={billInfo.displayName}
            paidAmount={billInfo.paidAmount}
            paidTime={billInfo.paidTime}
            paidNotes={billInfo.paidNotes}
        />
    )
}
export default PayPage
