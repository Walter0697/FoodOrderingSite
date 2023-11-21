import { Ordering } from '@prisma/client'

import { OrderingListItem } from '@/types/display/ordering'
import { OrderingType, SocketActionType } from '@/types/enum'
import { SocketActionData } from '@/types/socket'

import { ServerURLPrefix } from './constant'
import _ from 'lodash'

export const calculateTotalPrice = (list: Partial<Ordering>[]): number => {
    let total = 0
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const quantity = item.quantity ?? 0
        const price = item.price ?? 0
        total += quantity * price
    }
    return total
}

export const performActionOnList = (
    list: OrderingListItem[],
    actionData: Partial<SocketActionData>
) => {
    const newList = _.cloneDeep(list)
    switch (actionData.actionType) {
        case SocketActionType.Create: {
            newList.push({
                id: actionData?.orderId ?? -1,
                productIdentifier: actionData.productIdentifier ?? '',
                productName: actionData.productName ?? '',
                unitPrice: actionData.unitPrice ?? 0,
                quantity: actionData.quantity ?? 0,
                type: actionData.type as OrderingType,
                totalPrice:
                    (actionData.unitPrice ?? 0) * (actionData.quantity ?? 0),
                link: ServerURLPrefix.ChingKee + actionData.productIdentifier,
                createdBy: actionData.userDisplayName ?? '',
                updatedBy: actionData.userDisplayName ?? '',
            })
            break
        }
        case SocketActionType.Update: {
            const editingItem = newList.find((s) => s.id === actionData.orderId)
            if (editingItem) {
                editingItem.productName = actionData.productName ?? ''
                editingItem.unitPrice = actionData.unitPrice ?? 0
                editingItem.quantity = actionData.quantity ?? 0
                if (actionData.type) {
                    editingItem.type = actionData.type as OrderingType
                }
                ;(editingItem.totalPrice =
                    (actionData.unitPrice ?? 0) * (actionData.quantity ?? 0)),
                    (editingItem.link =
                        ServerURLPrefix.ChingKee + actionData.productIdentifier)
                editingItem.updatedBy = actionData.userDisplayName ?? ''
            }
            break
        }
        case SocketActionType.Remove: {
            const filteredList = newList.filter(
                (s) => s.id !== actionData.orderId
            )
            return filteredList
            break
        }
    }
    return newList
}
