import { OrderingType } from '@/types/enum'

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
