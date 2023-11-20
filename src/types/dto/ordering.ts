export type ManageOrderingDto = {
    productId: number
    category: string
    quantity: number
    price: number
    selectedMonth: string
}

export type EditOrderingDto = {
    orderId: number
    category: string
    quantity: number
}
