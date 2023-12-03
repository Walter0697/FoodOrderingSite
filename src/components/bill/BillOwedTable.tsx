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
import { SelectOptions } from '@/types/common'

import BillOwedDialog from '@/components/bill/BillOwedDialog'

import { FaEye } from 'react-icons/fa'

type BillOwedTableProps = {
    billList: DetailedBill[]
    userId: number
    userList: SelectOptions[]
}

const headCells = [
    {
        id: 'restaurant',
        label: 'Restaurant',
        paddingRight: false,
    },
    {
        id: 'paidAmount',
        label: 'Paid',
        paddingRight: false,
    },
    {
        id: 'numberOfPeople',
        label: 'Number of People Paid',
        paddingRight: false,
    },
    {
        id: 'missing',
        label: 'Missing Amount',
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

type DetailedBillListItem = DetailedBill & { missing: number }

function BillOwedTable({ billList, userId, userList }: BillOwedTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const [viewingItem, setViewingItem] = useState<DetailedBill | null>(null)

    const detailedList: DetailedBillListItem[] = billList.map((bill) => {
        const currentItem: DetailedBillListItem = {
            ...bill,
            missing: bill.totalPrice - (bill.paidAmount ?? 0),
        }

        return currentItem
    })

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'index') {
                return detailedList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.id - b.id
                        : b.id - a.id
                })
            }

            if (currentSorting.orderBy === 'restaurant') {
                return detailedList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.restaurantName.localeCompare(b.restaurantName)
                        : b.restaurantName.localeCompare(a.restaurantName)
                })
            }

            if (currentSorting.orderBy === 'numberOfPeople') {
                return detailedList.toSorted((a, b) => {
                    const aPaidRatio = a.paidRatio ?? 0
                    const bPaidRatio = b.paidRatio ?? 0
                    return currentSorting.order === 'asc'
                        ? aPaidRatio - bPaidRatio
                        : bPaidRatio - aPaidRatio
                })
            }

            if (currentSorting.orderBy === 'paidAmount') {
                return detailedList.toSorted((a, b) => {
                    const aAmount = a.paidAmount ?? 0
                    const bAmount = b.paidAmount ?? 0

                    return currentSorting.order === 'asc'
                        ? aAmount - bAmount
                        : bAmount - aAmount
                })
            }

            if (currentSorting.orderBy === 'missing') {
                return detailedList.toSorted((a, b) => {
                    const aAmount = a.paidAmount ?? 0
                    const bAmount = b.paidAmount ?? 0

                    return currentSorting.order === 'asc'
                        ? a.totalPrice - aAmount - (b.totalPrice - bAmount)
                        : b.totalPrice - bAmount - (a.totalPrice - aAmount)
                })
            }

            if (currentSorting.orderBy === 'totalPrice') {
                return detailedList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.totalPrice - b.totalPrice
                        : b.totalPrice - a.totalPrice
                })
            }
        }

        return detailedList.toSorted((a, b) => {
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
                                    backgroundColor:
                                        item.paidRatio === 1 ? 'yellow' : null,
                                }}
                            >
                                <TableCell align={'left'}>
                                    {item.restaurantName}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.paidAmount ? item.paidAmount : '-'}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.paidPeopleNumber ?? ''}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.missing}
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
            <BillOwedDialog
                open={viewingItem !== null}
                bill={viewingItem}
                handleClose={() => setViewingItem(null)}
                userId={userId}
                userList={userList}
                onSuccessHandler={() => {
                    window.location.reload()
                }}
            />
        </Paper>
    )
}

export default BillOwedTable
