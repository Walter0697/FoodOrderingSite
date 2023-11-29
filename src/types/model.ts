import { Ordering, Product, User, MonthlyOrder, Bill } from '@prisma/client'

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

export type DetailedBill = {
    creator?: User
    totalPriceFloat?: number
    paidAmount?: number | null
    paidTime?: Date | null
} & Bill
