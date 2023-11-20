import { Ordering, Product, User } from '@prisma/client'

export type DetailedOrdering = {
    product?: Product
    creator?: User
    updater?: User
} & Ordering
