import { ChingKeeProduct } from '@/types/scraper'
import axios from 'axios'
import * as cheerio from 'cheerio'

const scrapChingKee = async (url: string): Promise<ChingKeeProduct | null> => {
    try {
        const axiosResponse = await axios.request({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            },
        })

        const $ = cheerio.load(axiosResponse.data)
        const productDetails = $('.product-detail-actions')
        const productTitle = $('.Product-title')
        const productPrice = productDetails.find('.price-sale')

        let price = null
        if (productPrice.hasClass('member-price-tip-content')) {
            const innerPrice = productPrice.find('.price')
            price = innerPrice.text()
        } else {
            price = productPrice.text()
        }

        let priceNum = 0
        if (price) {
            priceNum = parseFloat(price.replace('HK$', '').trim())
        }

        const result: ChingKeeProduct = {
            productName: productTitle.text().trim(),
            productPrice: priceNum,
        }

        return result
    } catch (err: Error | unknown) {
        return null
    }
    return null
}

const scraperService = {
    scrapChingKee,
}

export default scraperService
