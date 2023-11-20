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
} from '@mui/material'

import { OrderingListItem } from '@/types/display/ordering'
import {
    getDisplayTextForOrderingType,
    getColorForOrderingType,
} from '@/utils/display'

import { block } from 'million/react'

type SortOrder = {
    orderBy: string
    order: 'asc' | 'desc'
}

type TableHeadProps = {
    itemList: OrderingListItem[]
    currentSorting: SortOrder | null
    setCurrentSorting: (currentSorting: string) => void
}

type OrderingTableProps = {
    itemList: OrderingListItem[]
    disabled?: boolean
    onItemEditHandler?: (item: OrderingListItem) => void
}

// name quantity type unit price total
const headCells = [
    {
        id: 'index',
        paddingLeft: false,
        label: '#',
    },
    {
        id: 'name',
        paddingLeft: false,
        label: 'Product Name',
    },
    {
        id: 'quantity',
        paddingLeft: true,
        label: 'Quantity',
    },
    {
        id: 'Type',
        paddingLeft: true,
        label: 'Type',
    },
    {
        id: 'price',
        paddingLeft: true,
        label: 'Unit Price',
    },
    {
        id: 'total',
        paddingLeft: true,
        label: 'Total',
    },
    {
        id: 'Updated By',
        paddingLeft: true,
        label: 'Updated By',
    },
]

function SortableTableHead({
    itemList,
    currentSorting,
    setCurrentSorting,
}: TableHeadProps) {
    return (
        <TableHead sx={{ backgroundColor: '#787878' }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.paddingLeft ? 'right' : 'left'}
                        padding={'normal'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
                <TableCell align={'right'} padding={'normal'}>
                    Action
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

function OrderingTable({
    itemList,
    disabled,
    onItemEditHandler,
}: OrderingTableProps) {
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const onCurrentSortingChangeHandler = (column: string) => {
        if (currentSorting) {
            if (currentSorting.orderBy === column) {
                setCurrentSorting(
                    currentSorting.order === 'asc'
                        ? { orderBy: column, order: 'desc' }
                        : { orderBy: column, order: 'asc' }
                )
                return
            }
        }
        setCurrentSorting({ orderBy: column, order: 'desc' })
    }

    return (
        <Paper
            sx={{
                maxHeight: '65vh',
                overflow: 'hidden',
            }}
        >
            <TableContainer sx={{ maxHeight: '65vh' }}>
                <Table sx={{ minWidth: 750 }} size={'small'} stickyHeader>
                    <SortableTableHead
                        itemList={itemList}
                        currentSorting={currentSorting}
                        setCurrentSorting={onCurrentSortingChangeHandler}
                    />
                    <TableBody>
                        {itemList.map((item, index) => (
                            <TableRow
                                hover
                                key={`item-${index}`}
                                sx={{
                                    height: '50px',
                                    fontSize: '20px',
                                    backgroundColor: getColorForOrderingType(
                                        item.type
                                    ),
                                }}
                            >
                                <TableCell align={'left'}>
                                    {index + 1}
                                </TableCell>
                                <TableCell align={'left'}>
                                    {item.productName}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {item.quantity}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {getDisplayTextForOrderingType(item.type)}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {item.unitPrice}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {item.totalPrice}
                                </TableCell>
                                <TableCell align={'right'}>
                                    {item.updatedBy}
                                </TableCell>
                                <TableCell align={'right'}>Action</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

const OrderingTableBlock = block(OrderingTable)
export default OrderingTableBlock
