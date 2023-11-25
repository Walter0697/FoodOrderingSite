import { getPrisma } from '@/utils/prisma'

import { ScrapProduct } from '@/types/scraper'
import { Product } from '@prisma/client'

const getProductById = async (productId: number): Promise<Product | null> => {
    const product = await getPrisma().product.findUnique({
        where: {
            id: productId,
        },
    })
    return product
}

const upsertProduct = async (
    identifier: string,
    information: ScrapProduct
): Promise<Product> => {
    const product = await getPrisma().product.findUnique({
        where: {
            identifier: identifier,
            deletedAt: null,
        },
    })

    if (product) {
        const updatedProduct = await getPrisma().product.update({
            where: {
                id: product.id,
            },
            data: {
                name: information.productName,
            },
        })
        return updatedProduct
    }

    const newProduct = await getPrisma().product.create({
        data: {
            name: information.productName,
            identifier: identifier,
            company: information.companyName,
        },
    })
    return newProduct
}

const productService = {
    getProductById,
    upsertProduct,
}

export default productService
