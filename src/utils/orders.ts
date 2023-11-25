import { FoodCompanyInformation } from './constant'

export const checkURLValid = (url: string) => {
    for (const company of FoodCompanyInformation) {
        if (url.includes(company.Acceptance)) {
            if (company.activated) {
                return true
            }
        }
    }
    return false
}
