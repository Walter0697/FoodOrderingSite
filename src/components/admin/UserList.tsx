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
    Box,
    Grid,
} from '@mui/material'

import { UserListItem } from '@/types/display/user'
import { SortOrder, TableHeadProps } from '@/types/sort'

import { AiFillEdit } from 'react-icons/ai'
import { TiTick, TiTimes } from 'react-icons/ti'

import { block } from 'million/react'

type OrderingTableProps = {
    itemList: UserListItem[]
    onItemEditHandler?: (item: UserListItem) => void
}

const headCells = [
    {
        id: 'username',
        paddingLeft: false,
        label: 'Username',
    },
    {
        id: 'displayname',
        paddingLeft: false,
        label: 'Display Name',
    },
    {
        id: 'rank',
        paddingLeft: false,
        label: 'Rank',
    },
    {
        id: 'activated',
        paddingLeft: true,
        label: 'Activated',
    },
    {
        id: 'favFood',
        paddingLeft: false,
        label: 'Favourite Snack',
    },
    {
        id: 'birthday',
        paddingLeft: false,
        label: 'Birthday',
    },
    {
        id: 'signed',
        paddingLeft: true,
        label: 'Signed In',
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

function UserList({ itemList }: OrderingTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
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

    const onEditHandler = async (ordering: UserListItem) => {
        // onItemEditHandler && onItemEditHandler(ordering)
    }

    return (
        <Box p={3}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h6" mb={5}>
                        User List
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
                                            <TableCell align={'left'}>
                                                {item.username}
                                            </TableCell>
                                            <TableCell align={'left'}>
                                                {item.displayname}
                                            </TableCell>
                                            <TableCell align={'left'}>
                                                {item.rank}
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                {item.activated ? (
                                                    <TiTick />
                                                ) : (
                                                    <TiTimes />
                                                )}
                                            </TableCell>
                                            <TableCell align={'left'}>
                                                {item.favFood}
                                            </TableCell>
                                            <TableCell align={'left'}>
                                                {item.birthday}
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                {item.signed ? (
                                                    <TiTick />
                                                ) : (
                                                    <TiTimes />
                                                )}
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                <IconButton
                                                    disabled={loading}
                                                    color={'success'}
                                                    onClick={() =>
                                                        onEditHandler(item)
                                                    }
                                                >
                                                    <AiFillEdit />
                                                </IconButton>
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

const UserListBlock = block(UserList)
export default UserListBlock
