import { getPrisma } from '@/utils/prisma'

import { ChingKeeProduct } from '@/types/scraper'
import { Product } from '@prisma/client'

const getProductById = async (productId: number): Promise<Product | null> => {
    const product = await getPrisma().product.findUnique({
        where: {
            id: productId,
        },
    })
    return product
}

const upsertChingKeeProduct = async (
    identifier: string,
    information: ChingKeeProduct
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
        },
    })
    return newProduct
}

const productService = {
    getProductById,
    upsertChingKeeProduct,
}

export default productService
