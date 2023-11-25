import { Ordering } from '@prisma/client'
import {
    MonthlyOrderStatus,
    OrderingType,
    SocketActionType,
} from '@/types/enum'
import { OrderingListItem } from '@/types/display/ordering'
import { DetailedOrdering } from '@/types/model'
import { FoodCompanyInformation } from './constant'
import {
    SocketActionData,
    SocketInformation,
    SocketStatusData,
} from '@/types/socket'

export const getDisplayTextForOrderingType = (orderingType: OrderingType) => {
    switch (orderingType) {
        case OrderingType.Drink: {
            return 'Drink'
        }
        case OrderingType.Food: {
            return 'Food'
        }
    }
    return ''
}

export const getColorForOrderingType = (orderingType: OrderingType) => {
    switch (orderingType) {
        case OrderingType.Drink: {
            return '#dce6ff'
        }
        case OrderingType.Food: {
            return '#dcffe6'
        }
    }
    return null
}

export const getProductIdentifierFromURL = (url: string) => {
    const decoded = decodeURIComponent(url)
    const split = decoded.split('/')
    const identifier = split[split.length - 1]
    return identifier
}

export const convertOrderingToOrderingListItem = (
    ordering: DetailedOrdering
): OrderingListItem => {
    let companyInfo = FoodCompanyInformation.find(
        (s) => s.Name === ordering.product?.company
    )
    if (!companyInfo) {
        // by default, it is the first one
        companyInfo = FoodCompanyInformation[0]
    }
    return {
        id: ordering.id ?? -1,
        productName: ordering.product?.name ?? '',
        productIdentifier: ordering.product?.identifier ?? '',
        unitPrice: ordering.price ?? 0,
        quantity: ordering.quantity ?? 0,
        type: ordering.category as OrderingType,
        totalPrice: (ordering.price ?? 0) * (ordering.quantity ?? 0),
        link: companyInfo.Prefix + ordering.product?.identifier ?? '',
        createdBy: ordering.creator?.displayname ?? '',
        updatedBy: ordering.updater?.displayname ?? '',
    }
}

export const convertOrderingToOrderingListItem_List = (
    orderings: Ordering[]
): OrderingListItem[] => {
    const list: OrderingListItem[] = []
    for (let i = 0; i < orderings.length; i++) {
        list.push(convertOrderingToOrderingListItem(orderings[i]))
    }
    return list
}

export const shouldPerformAction = (
    data: SocketInformation,
    selectedMonth: string,
    currentUserId: number
): boolean => {
    if (data.selectedMonth !== selectedMonth) return false
    if (data.userId === currentUserId) return false
    return true
}

export const convertSocketActionIntoToastMessage = (data: SocketActionData) => {
    switch (data.actionType) {
        case SocketActionType.Create: {
            return `${data.userDisplayName} added ${data.quantity} of "${data.productName}" to the cart! (${data.type})`
        }
        case SocketActionType.Update: {
            return `${data.userDisplayName} changed the quatity of "${data.productName}" to ${data.quantity}`
        }
        case SocketActionType.Remove: {
            return `${data.userDisplayName} removed "${data.productName}"`
        }
    }
}

export const convertSocketStatusIntoToastMessage = (data: SocketStatusData) => {
    switch (data.status) {
        case MonthlyOrderStatus.Pending: {
            return `${data.userDisplayName} unlocked this page! You can order again!`
        }
        case MonthlyOrderStatus.Ordering: {
            return `${data.userDisplayName} locked this page! Please contact him/her if you want to order!`
        }
        case MonthlyOrderStatus.Completed: {
            return `${data.userDisplayName} completed this order! Let's wait for the snack to arrive!`
        }
    }
}
