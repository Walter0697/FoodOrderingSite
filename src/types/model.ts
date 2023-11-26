import { Ordering, Product, User, MonthlyOrder } from '@prisma/client'

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
