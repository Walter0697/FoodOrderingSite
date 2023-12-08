export type BillPaymentInfo =
    | {
          success: true
          restaurantName: string
          photoUrl: string
          notes: string
          uploadUser: string
          displayName: string
          paidAmount?: number
          paidTime?: string
          paidNotes?: string
      }
    | BillPaymentErrorInfo

export type BillPaymentErrorInfo = {
    success: false
    title: string
    description: string
    joke: string
}
