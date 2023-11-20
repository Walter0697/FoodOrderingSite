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
} from '@mui/material'

import { OrderingListItem } from '@/types/display/ordering'
import {
    getDisplayTextForOrderingType,
    getColorForOrderingType,
} from '@/utils/display'

import { AiFillEdit } from 'react-icons/ai'
import { TbTrashXFilled } from 'react-icons/tb'

import toastHelper from '@/utils/toast'

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
    onItemRemoveHandler?: (item: OrderingListItem) => void
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
    onItemRemoveHandler,
}: OrderingTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
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

    const onEditHandler = async (ordering: OrderingListItem) => {}

    const onRemoveHandler = async (ordering: OrderingListItem) => {
        const confirmed = window.confirm(
            `Are you sure that you want to remove ${ordering.productName}`
        )
        if (confirmed) {
            setLoading(true)
            try {
                const response = await fetch(
                    `/api/ordering/item/${ordering.id}`,
                    {
                        method: 'DELETE',
                    }
                )
                if (response.status === 200) {
                    toastHelper.success(
                        `${ordering.productName} has been removed`
                    )
                    if (onItemRemoveHandler) {
                        onItemRemoveHandler(ordering)
                    }
                } else {
                    toastHelper.error(
                        `Failed to remove ${ordering.productName}`
                    )
                }
            } catch (err: Error | unknown) {
                if (err instanceof Error) {
                    toastHelper.error(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Paper
            sx={{
                maxHeight: '60vh',
                overflow: 'hidden',
            }}
        >
            <TableContainer sx={{ maxHeight: '50vh' }}>
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
                                <TableCell
                                    align={'left'}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => window.open(item.link)}
                                >
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
                                <TableCell align={'right'}>
                                    <IconButton
                                        disabled={disabled || loading}
                                        color={'success'}
                                        onClick={() => onEditHandler(item)}
                                    >
                                        <AiFillEdit />
                                    </IconButton>
                                    <IconButton
                                        disabled={disabled || loading}
                                        color={'error'}
                                        onClick={() => onRemoveHandler(item)}
                                    >
                                        <TbTrashXFilled />
                                    </IconButton>
                                </TableCell>
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
