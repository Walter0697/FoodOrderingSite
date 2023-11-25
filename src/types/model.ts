import { Ordering, Product, User, MonthlyOrder } from '@prisma/client'

export type DetailedOrdering = {
    product?: Product
    creator?: User
    updater?: User
} & Ordering

export type DetailedMonthlyOrder = {
    updater?: User
} & MonthlyOrder

export type ExtraInformationType = {
    birthday?: string
    favFood?: string
}
