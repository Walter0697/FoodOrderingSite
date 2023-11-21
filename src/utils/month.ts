import dayjs from 'dayjs'

export const getCurrentMonthIdentifier = () => {
    return dayjs().format('YYYY-MM')
}

export const getMonthIdentifier = (date: Date) => {
    return dayjs(date).format('YYYY-MM')
}

export const monthAllowEdit = (monthIdentifier: string) => {
    // get current dayjs item
    const current = dayjs()
    // get dayjs item by month identifier
    const month = dayjs(`${monthIdentifier}-${current.date()}`)
    // get difference between month and current
    const diff = month.diff(current, 'month')
    const monthDiff = Math.abs(diff)
    // if difference is less than 2, allow edit
    return monthDiff < 2
}
