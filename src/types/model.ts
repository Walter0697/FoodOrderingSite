import { Ordering, Product, User, MonthlyOrder, Bill } from '@prisma/client'

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
    totalPriceFloat?: number
    paidAmount?: number | null
    paidTime?: Date | null
} & Bill

export type DetailedBill = Without<ExtraFieldBill, 'totalPrice'>
