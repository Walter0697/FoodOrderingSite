import { Ordering } from '@prisma/client'
import { OrderingType } from '@/types/enum'
import { OrderingListItem } from '@/types/display/ordering'
import { DetailedOrdering } from '@/types/model'
import { ServerURLPrefix } from './constant'

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
    return {
        id: ordering.id ?? -1,
        productName: ordering.product?.name ?? '',
        unitPrice: ordering.price ?? 0,
        quantity: ordering.quantity ?? 0,
        type: ordering.category as OrderingType,
        totalPrice: (ordering.price ?? 0) * (ordering.quantity ?? 0),
        link: ServerURLPrefix.ChingKee + ordering.product?.identifier ?? '',
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
