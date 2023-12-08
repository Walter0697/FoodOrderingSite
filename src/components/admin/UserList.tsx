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
    Typography,
    Box,
    Grid,
} from '@mui/material'

import UserEditDialog from './UserEditDialog'

import { UserListItem } from '@/types/display/user'
import { SortOrder, TableHeadProps } from '@/types/sort'

import { AiFillEdit } from 'react-icons/ai'
import { TiTick, TiTimes } from 'react-icons/ti'

import { block } from 'million/react'

type OrderingTableProps = {
    itemList: UserListItem[]
}

const headCells = [
    {
        id: 'username',
        paddingRight: false,
        label: 'Username',
    },
    {
        id: 'displayname',
        paddingRight: false,
        label: 'Display Name',
    },
    {
        id: 'discordusername',
        paddingRight: false,
        label: 'Discord Name',
    },
    {
        id: 'rank',
        paddingRight: false,
        label: 'Rank',
    },
    {
        id: 'activated',
        paddingRight: true,
        label: 'Activated',
    },
    {
        id: 'favFood',
        paddingRight: false,
        label: 'Favourite Snack',
    },
    {
        id: 'birthday',
        paddingRight: false,
        label: 'Birthday',
    },
    {
        id: 'signed',
        paddingRight: true,
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

function UserList({ itemList }: OrderingTableProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [editingItem, setEditingItem] = useState<UserListItem | null>(null)
    const [currentSorting, setCurrentSorting] = useState<SortOrder | null>(null)

    const getSortedList = () => {
        if (currentSorting) {
            if (currentSorting.orderBy === 'username') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.username.localeCompare(a.username)
                    } else {
                        return a.username.localeCompare(b.username)
                    }
                })
            }
            if (currentSorting.orderBy === 'displayname') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.displayname.localeCompare(a.displayname)
                    } else {
                        return a.displayname.localeCompare(b.displayname)
                    }
                })
            }
            if (currentSorting.orderBy === 'discordusername') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.discordUsername.localeCompare(
                            a.discordUsername
                        )
                    } else {
                        return a.discordUsername.localeCompare(
                            b.discordUsername
                        )
                    }
                })
            }
            if (currentSorting.orderBy === 'rank') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.rank.localeCompare(a.rank)
                    } else {
                        return a.rank.localeCompare(b.rank)
                    }
                })
            }
            if (currentSorting.orderBy === 'activated') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.activated ? 1 : -1
                    } else {
                        return a.activated ? 1 : -1
                    }
                })
            }
            if (currentSorting.orderBy === 'favFood') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.favFood.localeCompare(a.favFood)
                    } else {
                        return a.favFood.localeCompare(b.favFood)
                    }
                })
            }
            if (currentSorting.orderBy === 'birthday') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.birthday.localeCompare(a.birthday)
                    } else {
                        return a.birthday.localeCompare(b.birthday)
                    }
                })
            }
            if (currentSorting.orderBy === 'signed') {
                return itemList.toSorted((a, b) => {
                    if (currentSorting.order === 'desc') {
                        return b.signed ? 1 : -1
                    } else {
                        return a.signed ? 1 : -1
                    }
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

    const onEditHandler = async (ordering: UserListItem) => {
        setEditingItem(ordering)
    }

    const onEditSuccessHandler = () => {
        setLoading(false)
        window.location.reload()
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
                                                {item.discordUsername}
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
            <UserEditDialog
                user={editingItem}
                open={editingItem !== null}
                onSuccessHandler={onEditSuccessHandler}
                handleClose={() => setEditingItem(null)}
            />
        </Box>
    )
}

const UserListBlock = block(UserList)
export default UserListBlock
