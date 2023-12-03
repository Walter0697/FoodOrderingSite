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
    IconButton,
    TableSortLabel,
} from '@mui/material'

import { DetailedBill } from '@/types/model'
import { SortOrder, TableHeadProps } from '@/types/sort'

import OwedBillDialog from '@/components/bill/OwedBillDialog'

import { FaEye } from 'react-icons/fa'

type OwedBillTableProps = {
    billList: DetailedBill[]
    userId: number
}

const headCells = [
    {
        id: 'restaurant',
        label: 'Restaurant',
        paddingRight: false,
    },
    {
        id: 'createdBy',
        label: 'Should Paid',
        paddingRight: false,
    },
    {
        id: 'paidAmount',
        label: 'Paid',
        paddingRight: false,
    },
    {
        id: 'paidTime',
        label: 'Paid Time',
        paddingRight: false,
    },
    {
        id: 'totalPrice',
        label: 'Total Price',
        paddingRight: true,
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
                <TableCell align={'right'} padding={'normal'}>
                    Action
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

function OwedBillTable({ billList, userId }: OwedBillTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const [viewingItem, setViewingItem] = useState<DetailedBill | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'index') {
                return billList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.id - b.id
                        : b.id - a.id
                })
            }

            if (currentSorting.orderBy === 'restaurant') {
                return billList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.restaurantName.localeCompare(b.restaurantName)
                        : b.restaurantName.localeCompare(a.restaurantName)
                })
            }

            if (currentSorting.orderBy === 'createdBy') {
                return billList.toSorted((a, b) => {
                    const aName = a.creator ? a.creator.displayname : ''
                    const bName = b.creator ? b.creator.displayname : ''
                    return currentSorting.order === 'asc'
                        ? aName.localeCompare(bName)
                        : bName.localeCompare(aName)
                })
            }

            if (currentSorting.orderBy === 'paidAmount') {
                return billList.toSorted((a, b) => {
                    const aAmount = a.paidAmount ?? 0
                    const bAmount = b.paidAmount ?? 0

                    return currentSorting.order === 'asc'
                        ? aAmount - bAmount
                        : bAmount - aAmount
                })
            }

            if (currentSorting.orderBy === 'paidTime') {
                return billList.toSorted((a, b) => {
                    const aTime = a.paidTime ?? ''
                    const bTime = b.paidTime ?? ''
                    return currentSorting.order === 'asc'
                        ? aTime.localeCompare(bTime)
                        : bTime.localeCompare(aTime)
                })
            }

            if (currentSorting.orderBy === 'totalPrice') {
                return billList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.totalPrice - b.totalPrice
                        : b.totalPrice - a.totalPrice
                })
            }
        }

        return billList.toSorted((a, b) => {
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

    const onViewHandler = (item: DetailedBill) => {
        setViewingItem(item)
    }

    return (
        <Paper
            sx={{
                maxHeight: '60vh',
                overflow: 'hidden',
            }}
        >
            <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table sx={{ minWidth: 750 }} size={'small'} stickyHeader>
                    <SortableTableHead
                        currentSorting={currentSorting}
                        setCurrentSorting={onCurrentSortingChangeHandler}
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
                                <TableCell align={'left'}>
                                    {item.restaurantName}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.creator
                                        ? item.creator.displayname
                                        : ''}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.paidAmount ? item.paidAmount : '-'}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.paidTime ? item.paidTime : '-'}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {item.totalPrice}
                                </TableCell>
                                <TableCell align={'right'}>
                                    <IconButton
                                        disabled={loading}
                                        color={'success'}
                                        onClick={() => onViewHandler(item)}
                                    >
                                        <FaEye />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <OwedBillDialog
                open={viewingItem !== null}
                bill={viewingItem}
                handleClose={() => setViewingItem(null)}
                userId={userId}
                onSuccessHandler={() => {
                    window.location.reload()
                }}
            />
        </Paper>
    )
}

export default OwedBillTable
