import { getPrisma } from '@/utils/prisma'
import discordHelper from './discord'

const checkBillPaidRecordComplete = async (billId: number): Promise<void> => {
    const currentBill = await getPrisma().bill.findFirst({
        where: {
            id: billId,
        },
    })

    if (!currentBill) {
        return
    }

    const uploadUser = await getPrisma().user.findFirst({
        where: {
            id: currentBill.createdBy,
        },
    })

    if (!uploadUser) {
        return
    }

    if (!uploadUser.discordUsername) {
        // if upload user doesn't have discord username, we don't need to alert
        return
    }

    const billPaidRecords = await getPrisma().billPaidRecord.findMany({
        where: {
            billId,
            deletedAt: null,
        },
    })

    const targetUsersLength = currentBill.targetUsers.length
    const billPaidRecordsLength = billPaidRecords.length

    if (targetUsersLength !== billPaidRecordsLength) {
        return
    }

    discordHelper.alertUserWhenBillCompleted(uploadUser, currentBill)
}

const paidService = {
    checkBillPaidRecordComplete,
}

export default paidService
