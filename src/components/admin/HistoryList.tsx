'use client'

import { useState } from 'react'
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Paper,
    TableSortLabel,
    Typography,
    Box,
    Grid,
} from '@mui/material'

import { MonthlyOrderListItem } from '@/types/display/ordering'
import { SortOrder, TableHeadProps } from '@/types/sort'

import dayjs from 'dayjs'
import { block } from 'million/react'

type OrderingTableProps = {
    itemList: MonthlyOrderListItem[]
}

const headCells = [
    {
        id: 'selectedMonth',
        paddingRight: false,
        label: 'Selected Month',
    },
    {
        id: 'expectedPrice',
        paddingRight: true,
        label: 'Expected Price',
    },
    {
        id: 'actualPrice',
        paddingRight: true,
        label: 'Actual Price',
    },
    {
        id: 'expectedDeliveryDate',
        paddingRight: true,
        label: 'Expected Delivery Date',
    },
    {
        id: 'updatedBy',
        paddingRight: true,
        label: 'Updated By',
    },
    {
        id: 'updatedAt',
        paddingRight: true,
        label: 'Updated At',
    },
]

function SortableTableHead({
    currentSorting,
    setCurrentSorting,
}: TableHeadProps) {
    return (
        <TableHead sx={{ backgroundColor: '#787878' }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.paddingRight ? 'right' : 'left'}
                        padding={'normal'}
                    >
                        <TableSortLabel
                            active={
                                currentSorting
                                    ? currentSorting.orderBy === headCell.id
                                    : false
                            }
                            direction={
                                currentSorting
                                    ? currentSorting.order
                                    : undefined
                            }
                            onClick={() => setCurrentSorting(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

function HistoryList({ itemList }: OrderingTableProps) {
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'selectedMonth') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return dayjs(`${b.selectedMonth}-01`).diff(
                            dayjs(`${a.selectedMonth}-01`)
                        )
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return dayjs(`${a.selectedMonth}-01`).diff(
                            dayjs(`${b.selectedMonth}-01`)
                        )
                    })
                }
            } else if (currentSorting.orderBy === 'expectedPrice') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return b.expectedPrice - a.expectedPrice
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return a.expectedPrice - b.expectedPrice
                    })
                }
            } else if (currentSorting.orderBy === 'actualPrice') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return b.actualPrice - a.actualPrice
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return a.actualPrice - b.actualPrice
                    })
                }
            } else if (currentSorting.orderBy === 'expectedDeliveryDate') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return dayjs(b.expectedDeliveryDate).diff(
                            dayjs(a.expectedDeliveryDate)
                        )
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return dayjs(a.expectedDeliveryDate).diff(
                            dayjs(b.expectedDeliveryDate)
                        )
                    })
                }
            } else if (currentSorting.orderBy === 'updatedBy') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return a.updatedBy.localeCompare(b.updatedBy)
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return b.updatedBy.localeCompare(a.updatedBy)
                    })
                }
            } else if (currentSorting.orderBy === 'updatedAt') {
                if (currentSorting.order === 'desc') {
                    return itemList.sort((a, b) => {
                        return dayjs(b.updatedAt).diff(dayjs(a.updatedAt))
                    })
                } else {
                    return itemList.sort((a, b) => {
                        return dayjs(a.updatedAt).diff(dayjs(b.updatedAt))
                    })
                }
            }
        }
        return itemList.toSorted((a, b) => {
            return a.id - b.id
        })
    }
    const sortedList = getSortedList()

    const onCurrentSortingChangeHandler = (column: string) => {
        if (currentSorting) {
            if (currentSorting.orderBy === column) {
                if (currentSorting.order === 'desc') {
                    setCurrentSorting({ orderBy: column, order: 'asc' })
                } else {
                    setCurrentSorting(null)
                }
                return
            }
        }
        setCurrentSorting({ orderBy: column, order: 'desc' })
    }

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h6" mb={5}>
                        History List
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            maxHeight: '80vh',
                            overflow: 'hidden',
                        }}
                    >
                        <TableContainer sx={{ maxHeight: '50vh' }}>
                            <Table
                                sx={{ minWidth: 750 }}
                                size={'small'}
                                stickyHeader
                            >
                                <SortableTableHead
                                    currentSorting={currentSorting}
                                    setCurrentSorting={
                                        onCurrentSortingChangeHandler
                                    }
                                />
                                <TableBody>
                                    {sortedList.map((item, index) => (
                                        <TableRow
                                            hover
                                            key={`item-${index}`}
                                            sx={{
                                                height: '50px',
                                                fontSize: '20px',
                                            }}
                                        >
                                            <TableCell
                                                align={'left'}
                                                padding={'normal'}
                                            >
                                                {item.selectedMonth}
                                            </TableCell>
                                            <TableCell
                                                align={'right'}
                                                padding={'normal'}
                                            >
                                                {item.expectedPrice}
                                            </TableCell>
                                            <TableCell
                                                align={'right'}
                                                padding={'normal'}
                                            >
                                                {item.actualPrice}
                                            </TableCell>
                                            <TableCell
                                                align={'right'}
                                                padding={'normal'}
                                            >
                                                {item.expectedDeliveryDate}
                                            </TableCell>
                                            <TableCell
                                                align={'right'}
                                                padding={'normal'}
                                            >
                                                {item.updatedBy}
                                            </TableCell>
                                            <TableCell
                                                align={'right'}
                                                padding={'normal'}
                                            >
                                                {item.updatedAt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

const HistoryListBlock = block(HistoryList)
export default HistoryListBlock
