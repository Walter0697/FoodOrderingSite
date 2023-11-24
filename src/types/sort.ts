export type SortOrder = {
    orderBy: string
    order: 'asc' | 'desc'
}

export type TableHeadProps = {
    currentSorting: SortOrder | null
    setCurrentSorting: (currentSorting: string) => void
}
