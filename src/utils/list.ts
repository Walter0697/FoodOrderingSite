import { Ordering } from '@prisma/client'

import { OrderingListItem } from '@/types/display/ordering'
import { OrderingType, SocketActionType } from '@/types/enum'
import { SocketActionData } from '@/types/socket'

import { FoodCompanyInformation, ConstantValue } from './constant'
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
    let companyInfo = FoodCompanyInformation.find(
        (s) => s.Name === actionData.productCompany
    )
    if (!companyInfo) {
        // by default, it is the first one
        companyInfo = FoodCompanyInformation[0]
    }
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
                link: companyInfo.Prefix + actionData.productIdentifier,
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
                        companyInfo.Prefix + actionData.productIdentifier)
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

export const balanceWeight = (balance: number): string | null => {
    if (balance >= 0) return null
    const overflow = Math.abs(balance)
    const allowanceOverflow =
        ConstantValue.TotalBudget * ConstantValue.OverBudgetPercentage
    // by dividing into 10, it can have 0, 1, 2, 3, 4...... to 9 segment
    // fontWeight bold only has 9 level from 100 to 900
    const allowanceOverflowSegment = allowanceOverflow / 10
    const segment = Math.floor(overflow / allowanceOverflowSegment)
    if (segment === 0) return null

    // prevent too large since fontWeight max is 900
    if (segment > 9) return '900'
    return `${segment}00`
}

// returning a list of orderIds
// by removing one quatity of these following items, the balance will not overflow
export const avoidOverflow = (itemList: OrderingListItem[]): number[] => {
    const orderingList: Partial<Ordering>[] = itemList.map((s) => {
        return {
            quantity: s.quantity,
            price: s.unitPrice,
        }
    })
    const totalPrice = calculateTotalPrice(orderingList)
    const balanceLeft = ConstantValue.TotalBudget - totalPrice
    if (balanceLeft < 0) {
        const overflow = Math.abs(balanceLeft)
        const validList = itemList.filter((s) => {
            // don't remove the item, just reduce the quantity
            if (s.quantity === 1) return false
            if (s.unitPrice < overflow) return false
            return true
        })

        return validList.map((s) => s.id)
    }

    return []
}
