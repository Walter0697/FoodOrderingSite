import { ScrapProduct } from '@/types/scraper'
import { FoodCompany, FoodCompanyInformation } from '@/utils/constant'
import axios from 'axios'
import * as cheerio from 'cheerio'

const scrapProduct = async (url: string): Promise<ScrapProduct | null> => {
    for (const company of FoodCompanyInformation) {
        if (url.includes(company.Acceptance)) {
            if (company.activated) {
                switch (company.Name) {
                    case FoodCompany.ChingKee: {
                        return await scrapChingKee(url)
                    }
                }
            }
        }
    }
    return null
}

const scrapChingKee = async (url: string): Promise<ScrapProduct | null> => {
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

        const result: ScrapProduct = {
            companyName: FoodCompany.ChingKee,
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
    scrapProduct,
}

export default scraperService
