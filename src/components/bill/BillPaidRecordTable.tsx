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
} from '@mui/material'

import { DetailedBillPaidRecord } from '@/types/model'
import { SortOrder, TableHeadProps } from '@/types/sort'

import { block } from 'million/react'

type BillPaidRecordTableProps = {
    itemList: DetailedBillPaidRecord[]
    userId: number
}

const headCells = [
    {
        id: 'index',
        paddingRight: false,
        label: '#',
    },
    {
        id: 'amount',
        paddingRight: true,
        label: 'Amount',
    },
    {
        id: 'notes',
        paddingRight: true,
        label: 'Notes',
    },
    {
        id: 'paidBy',
        paddingRight: true,
        label: 'Paid By',
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

function BillPaidRecordTable({ itemList, userId }: BillPaidRecordTableProps) {
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'index') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.id - b.id
                        : b.id - a.id
                })
            }

            if (currentSorting.orderBy === 'notes') {
                return itemList.toSorted((a, b) => {
                    const aNotes = a.notes ?? ''
                    const bNotes = b.notes ?? ''
                    return currentSorting.order === 'asc'
                        ? aNotes.localeCompare(bNotes)
                        : bNotes.localeCompare(aNotes)
                })
            }

            if (currentSorting.orderBy === 'amount') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.Amount - b.Amount
                        : b.Amount - a.Amount
                })
            }

            if (currentSorting.orderBy === 'paidBy') {
                return itemList.toSorted((a, b) => {
                    const aName = a.creator?.displayname ?? ''
                    const bName = b.creator?.displayname ?? ''
                    return currentSorting.order === 'asc'
                        ? aName.localeCompare(bName)
                        : bName.localeCompare(aName)
                })
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
        <Paper>
            <TableContainer sx={{ maxHeight: '50vh' }}>
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
                                        userId === item.createdBy
                                            ? 'yellow'
                                            : 'inherit',
                                }}
                            >
                                <TableCell align={'left'} padding={'normal'}>
                                    {index + 1}
                                </TableCell>
                                <TableCell align={'right'} padding={'normal'}>
                                    {item.Amount}
                                </TableCell>
                                <TableCell align={'right'} padding={'normal'}>
                                    {item.notes}
                                </TableCell>
                                <TableCell align={'right'} padding={'normal'}>
                                    {item.creator?.displayname}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

const BillPaidRecordTableBlock = block(BillPaidRecordTable)
export default BillPaidRecordTableBlock
