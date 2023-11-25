import { FoodCompany } from '@/utils/constant'

export type ScrapProduct = {
    companyName: keyof typeof FoodCompany
    productName: string
    productPrice: number
}

export type ScraperProductType = {
    productName: string
    productId: number
    productPrice: number
    productIdentifier: string
    companyName: string
}
