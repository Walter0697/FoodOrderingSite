import type { NextApiRequest, NextApiResponse } from 'next'
import productService from '@/services/product'
import scraperService from '@/services/scraper'

import { ScraperProductType } from '@/types/scraper'

import { getProductIdentifierFromURL } from '@/utils/display'
import { userMiddleware } from '@/middlewares/user'

type SearchProductRequestBody = {
    url: string
}

type SearchResponseData =
    | {
          success: true
          data: ScraperProductType
      }
    | {
          success: false
          message: string
      }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SearchResponseData>
) {
    const requestMethod = req.method

    switch (requestMethod) {
        case 'POST': {
            const user = await userMiddleware(req)
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'invalid authentication',
                })
            }

            const body: SearchProductRequestBody = JSON.parse(req.body)
            const productInformation = await scraperService.scrapChingKee(
                body.url
            )
            if (!productInformation) {
                return res.status(200).json({
                    success: false,
                    message: 'Cannot find Product from the store',
                })
            }
            const productIdentifier = getProductIdentifierFromURL(body.url)
            const product = await productService.upsertChingKeeProduct(
                productIdentifier,
                productInformation
            )

            return res.status(200).json({
                success: true,
                data: {
                    productName: product.name,
                    productId: product.id,
                    productPrice: productInformation.productPrice,
                },
            })
        }
    }
}