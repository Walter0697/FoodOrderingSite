import { ServerURLPrefix } from './constant'

export const checkURLValid = (url: string) => {
    if (url.startsWith(ServerURLPrefix.ChingKee)) {
        return true
    }
    return false
}
