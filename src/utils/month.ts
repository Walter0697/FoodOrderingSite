import dayjs from 'dayjs'

export const getCurrentMonthIdentifier = () => {
    return dayjs().format('YYYY-MM')
}

export const getMonthIdentifier = (date: Date) => {
    return dayjs(date).format('YYYY-MM')
}
