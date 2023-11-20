'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useUserData from '@/stores/useUserData'

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Drawer,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    List,
    Divider,
} from '@mui/material'
import { IoMenu, IoPerson, IoPeople } from 'react-icons/io5'
import { MdRestaurantMenu, MdHistory } from 'react-icons/md'
import { BsFilePersonFill } from 'react-icons/bs'
import { BiSolidFoodMenu } from 'react-icons/bi'

import { UserSessionData } from '@/types/session'

import { block } from 'million/react'

const ListItems = [
    {
        text: 'Personal Information',
        icon: <BsFilePersonFill />,
        link: '/ordering/account',
    },
    {
        text: 'User List',
        adminOnly: true,
        icon: <IoPeople />,
        link: '/ordering/users',
    },
    {
        text: 'Ordering Dashboard',
        icon: <BiSolidFoodMenu />,
        link: '/ordering/dashboard',
    },
    {
        text: 'History',
        adminOnly: true,
        icon: <MdHistory />,
        link: '/ordering/history',
    },
]

function TopBar({ userSession }: { userSession: UserSessionData | null }) {
    const pathname = usePathname()
    const router = useRouter()
    const setUserData = useUserData((state) => state.setUserData)

    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        if (!userSession) return
        setUserData(userSession)
    }, [userSession, setUserData])

    const itemList = useMemo(() => {
        if (!userSession) return []
        if (userSession.rank === 'admin') return ListItems

        const currentList = ListItems.filter((item) => !item.adminOnly)
        return currentList
    }, [userSession])

    const onLogoutHandler = async () => {
        try {
            const result = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            if (result.status === 200) {
                router.push('/login')
            }
        } catch (err: Error | unknown) {
            if (err instanceof Error) {
                console.log(err.message)
            }
        }
    }

    const onPathClick = (path: string) => {
        router.push(path)
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        background: 'linear-gradient(164deg, #ff5555, #fff2f2)',
                    }}
                >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        id={'sideMenuBtn'}
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        {openMenu ? <MdRestaurantMenu /> : <IoMenu />}
                    </IconButton>
                    <Typography fontWeight={'bold'} sx={{ flexGrow: 1 }}>
                        Food Ordering
                    </Typography>
                    <Button
                        sx={{ color: '#883333' }}
                        id={'logoutBtn'}
                        onClick={() => onLogoutHandler()}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor={'left'}
                open={openMenu}
                onClose={() => setOpenMenu(false)}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <IoPerson />
                                </ListItemIcon>
                                <ListItemText
                                    primary={userSession?.displayname ?? ''}
                                    secondary={userSession?.rank ?? ''}
                                />
                            </ListItemButton>
                        </ListItem>
                        <Divider />

                        {itemList.map((item, index) => (
                            <ListItem
                                disablePadding
                                key={`item-${index}`}
                                selected={pathname === item.link}
                            >
                                <ListItemButton
                                    onClick={() => onPathClick(item.link)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

const TopBarBlock = block(TopBar)
export default TopBarBlock
