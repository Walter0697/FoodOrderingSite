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

export type MonthlyOrderListItem = {
    id: number
    selectedMonth: string
    expectedPrice: number
    actualPrice: number
    expectedDeliveryDate: string
    updatedBy: string
    updatedAt: string
}
