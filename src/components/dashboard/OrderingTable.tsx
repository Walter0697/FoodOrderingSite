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
    Tooltip,
    Typography,
    Stack,
} from '@mui/material'

import { OrderingListItem } from '@/types/display/ordering'
import {
    getDisplayTextForOrderingType,
    getColorForOrderingType,
} from '@/utils/display'

import { OrderingType } from '@/types/enum'
import { SortOrder, TableHeadProps } from '@/types/sort'

import { AiFillEdit } from 'react-icons/ai'
import { TbTrashXFilled } from 'react-icons/tb'
import { FaCircleInfo } from 'react-icons/fa6'

import toastHelper from '@/utils/toast'
import { avoidOverflow } from '@/utils/list'

import { block } from 'million/react'

type OrderingTableProps = {
    itemList: OrderingListItem[]
    disabled?: boolean
    onItemEditHandler?: (item: OrderingListItem) => void
    onItemRemoveHandler?: (item: OrderingListItem) => void
}

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
        id: 'type',
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
        id: 'updatedBy',
        paddingLeft: true,
        label: 'Updated By',
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
                        align={headCell.paddingLeft ? 'right' : 'left'}
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

const OrderingTypeOrder = {
    [OrderingType.Food]: 0,
    [OrderingType.Drink]: 1,
}

function OrderingTable({
    itemList,
    disabled,
    onItemEditHandler,
    onItemRemoveHandler,
}: OrderingTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'name') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.productName.localeCompare(b.productName)
                        : b.productName.localeCompare(a.productName)
                })
            }
            if (currentSorting.orderBy === 'quantity') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.quantity - b.quantity
                        : b.quantity - a.quantity
                })
            }
            if (currentSorting.orderBy === 'type') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? OrderingTypeOrder[a.type] - OrderingTypeOrder[b.type]
                        : OrderingTypeOrder[b.type] - OrderingTypeOrder[a.type]
                })
            }
            if (currentSorting.orderBy === 'price') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.unitPrice - b.unitPrice
                        : b.unitPrice - a.unitPrice
                })
            }
            if (currentSorting.orderBy === 'total') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.totalPrice - b.totalPrice
                        : b.totalPrice - a.totalPrice
                })
            }
            if (currentSorting.orderBy === 'updatedBy') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.updatedBy.localeCompare(b.updatedBy)
                        : b.updatedBy.localeCompare(a.updatedBy)
                })
            }
            if (currentSorting.orderBy === 'index') {
                return itemList.toSorted((a, b) => {
                    return currentSorting.order === 'asc'
                        ? a.id - b.id
                        : b.id - a.id
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

    const onEditHandler = async (ordering: OrderingListItem) => {
        onItemEditHandler && onItemEditHandler(ordering)
    }

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

    const avoidOverflowList = avoidOverflow(itemList)

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
                                    backgroundColor: getColorForOrderingType(
                                        item.type
                                    ),
                                }}
                            >
                                <TableCell align={'left'}>
                                    <Stack
                                        direction={'row'}
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'flex-start'}
                                    >
                                        <Typography variant={'h6'}>
                                            {index + 1}
                                        </Typography>
                                        {avoidOverflowList.includes(
                                            item.id
                                        ) && (
                                            <Tooltip
                                                title={
                                                    'Removing one of this can avoid overflow'
                                                }
                                            >
                                                <IconButton color={'info'}>
                                                    <FaCircleInfo />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
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
