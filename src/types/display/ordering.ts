import { OrderingType } from '@/types/enum'

export type OrderingListItem = {
    id: number
    productIdentifier: string
    productName: string
    unitPrice: number
    quantity: number
    type: OrderingType
    totalPrice: number
    link: string
    createdBy: string
    updatedBy: string
}
