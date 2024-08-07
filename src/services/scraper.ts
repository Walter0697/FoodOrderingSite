import { ScrapProduct } from '@/types/scraper'
import { FoodCompany, FoodCompanyInformation } from '@/utils/constant'
import axios from 'axios'
import https from 'https'
import * as cheerio from 'cheerio'

const scrapProduct = async (url: string): Promise<ScrapProduct | null> => {
    for (const company of FoodCompanyInformation) {
        if (url.includes(company.Acceptance)) {
            if (company.activated) {
                switch (company.Name) {
                    case FoodCompany.ChingKee: {
                        return await scrapChingKee(url)
                    }
                    case FoodCompany.ParknShop: {
                        return await scrapParknShop(url)
                    }
                    case FoodCompany.Wellcome: {
                        return await scrapWellcome(url)
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

const scrapParknShop = async (url: string): Promise<ScrapProduct | null> => {
    try {
        const axiosResponse = await axios.request({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            },
        })

        const $ = cheerio.load(axiosResponse.data)
        const productTitle = $('.product-name')
        const productBrand = $('.product-brand')
        const productUnit = $('.product-unit')

        const productPrice = $('.currentPrice')

        let productLabel = productTitle.text().trim()
        if (productBrand.length > 0 && productBrand.text().trim() !== '') {
            productLabel = `${productBrand.text().trim()} ${productLabel}`
        }
        if (productUnit.length > 0 && productUnit.text().trim() !== '') {
            productLabel = `${productLabel} (${productUnit.text().trim()})`
        }

        let priceNum = 0
        if (productPrice.length > 0) {
            priceNum = parseFloat(productPrice.text().replace('$', '').trim())
        }

        const result: ScrapProduct = {
            companyName: FoodCompany.ParknShop,
            productName: productLabel,
            productPrice: priceNum,
        }

        return result
    } catch (err: Error | unknown) {
        return null
    }

    return null
}

const scrapWellcome = async (url: string): Promise<ScrapProduct | null> => {
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const axiosResponse = await axios.request({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            },
            httpsAgent: httpsAgent
        })

        const $ = cheerio.load(axiosResponse.data)

        const productInfo = $('.info-content')
        const productTitle = productInfo.find('.title')
        const price = productInfo.find('.price')
        const smallPrice = productInfo.find('.price-small')

        let productLabel = ''
        if (productTitle.length > 0) {
            productLabel = productTitle.first().text().trim()
        }

        let priceLabel = `${price.text().trim()}${smallPrice.text().trim()}`

        let priceNum = 0
        if (priceLabel) {
            priceNum = parseFloat(priceLabel.replace('$', '').trim())
        }

        const result: ScrapProduct = {
            companyName: FoodCompany.Wellcome,
            productName: productLabel,
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
