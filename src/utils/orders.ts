const ChingKeeAcceptance = '35261646.com.hk/products/'
export const checkURLValid = (url: string) => {
    if (url.includes(ChingKeeAcceptance)) {
        return true
    }
    return false
}
