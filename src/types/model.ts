import {
    Ordering,
    Product,
    User,
    MonthlyOrder,
    Bill,
    BillPaidRecord,
} from '@prisma/client'

type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L]
}

export type DetailedOrdering = {
    product?: Product
    creator?: User
    updater?: User
    priceFloat?: number
} & Ordering


export type DetailedMonthlyOrder = {
    updater?: User
    expectedPriceFloat?: number
    actualPriceFloat?: number
} & MonthlyOrder

export type ExtraInformationType = {
    birthday?: string
    favFood?: string
}

type ExtraFieldBill = {
    creator?: User
    paidAmount?: number | null
    paidTime?: string | null
} & Bill

export type DetailedBill = Without<ExtraFieldBill, 'totalPrice'> & {
    totalPrice: number
}

type ExtraFieldBillPaidRecord = {
    creator?: User
    updater?: User
} & BillPaidRecord

export type DetailedBillPaidRecord = Without<
    ExtraFieldBillPaidRecord,
    'Amount'
> & { Amount: number }
