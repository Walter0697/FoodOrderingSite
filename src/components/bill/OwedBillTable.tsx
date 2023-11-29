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

import toastHelper from '@/utils/toast'

type OwedBillTableProps = {
    billList: DetailedBill[]
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

function OwedBillTable({ billList }: OwedBillTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const [viewingItem, setViewingItem] = useState<DetailedBill | null>(null)

    const getSortedList = () => {
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
                                <TableCell align={'left'}>{'-'}</TableCell>
                                <TableCell align={'right'}>
                                    {item.totalPriceFloat
                                        ? item.totalPriceFloat.toFixed(2)
                                        : 0}
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
                onSuccessHandler={() => {
                    setViewingItem(null)
                    toastHelper.success('Successfully updated bill')
                }}
            />
        </Paper>
    )
}

export default OwedBillTable
