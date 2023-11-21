import { Server } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'
import {
    NextApiResponseWithSocket,
    SocketActionData,
    SocketCompleteData,
    SocketStatusData,
} from '@/types/socket'

import userService from '@/services/user'

import { userMiddleware } from '@/middlewares/user'
import { SocketActionType } from '@/types/enum'
import { UserSessionData } from '@/types/session'

type ResponseData = {
    success?: boolean
    message?: string
}

const SocketUserMap: Map<string, Partial<UserSessionData>> = new Map()

// Create a socket.io server
export default async function SocketHandler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket<ResponseData>
) {
    const user = await userMiddleware(req)
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'invalid authentication',
        })
    }
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server)

        // Listen for connection events
        io.on('connection', (socket) => {
            console.log(`Socket ${socket.id} connected.`)

            socket.on('initialze', (data: Partial<UserSessionData>) => {
                console.log(`Setting up ${socket.id} for ${data.displayname}.`)
                SocketUserMap.set(socket.id, data)
            })

            socket.on('performed', (data: Partial<SocketActionData>) => {
                for (const currentSocket of io.sockets.sockets.values()) {
                    if (currentSocket.id !== socket.id) {
                        if (
                            data.actionType === SocketActionType.Create ||
                            data.actionType === SocketActionType.Update
                        ) {
                            currentSocket.emit('action', {
                                actionType: data.actionType,
                                userId: SocketUserMap.get(socket.id)?.id,
                                userDisplayName: SocketUserMap.get(socket.id)
                                    ?.displayname,
                                productName: data.productName,
                                productIdentifier: data.productIdentifier,
                                orderId: data.orderId,
                                selectedMonth: data.selectedMonth,
                                unitPrice: data.unitPrice,
                                quantity: data.quantity,
                                type: data.type,
                            })
                        } else if (
                            data.actionType === SocketActionType.Remove
                        ) {
                            currentSocket.emit('action', {
                                actionType: data.actionType,
                                userId: SocketUserMap.get(socket.id)?.id,
                                userDisplayName: SocketUserMap.get(socket.id)
                                    ?.displayname,
                                productName: data.productName,
                                orderId: data.orderId,
                                selectedMonth: data.selectedMonth,
                            })
                        }
                    }
                }
            })

            socket.on('setstatus', async (data: Partial<SocketStatusData>) => {
                const currentUserData = SocketUserMap.get(socket.id)
                if (currentUserData && currentUserData.id) {
                    const currentUser = await userService.getUserById(
                        currentUserData.id
                    )
                    if (!currentUser) return
                    if (currentUser.rank !== 'admin') return

                    for (const currentSocket of io.sockets.sockets.values()) {
                        if (currentSocket.id !== socket.id) {
                            currentSocket.emit('status', {
                                status: data.status,
                                selectedMonth: data.selectedMonth,
                                userId: SocketUserMap.get(socket.id)?.id,
                                userDisplayName: SocketUserMap.get(socket.id)
                                    ?.displayname,
                            })
                        }
                    }
                }
            })

            socket.on(
                'setcomplete',
                async (data: Partial<SocketCompleteData>) => {
                    const currentUserData = SocketUserMap.get(socket.id)
                    if (currentUserData && currentUserData.id) {
                        const currentUser = await userService.getUserById(
                            currentUserData.id
                        )
                        if (!currentUser) return
                        if (currentUser.rank !== 'admin') return
                        
                        for (const currentSocket of io.sockets.sockets.values()) {
                            if (currentSocket.id !== socket.id) {
                                currentSocket.emit('complete', {
                                    reason: data.reason,
                                    actualPrice: data.actualPrice,
                                    expectedDeliveryDate:
                                        data.expectedDeliveryDate,
                                    selectedMonth: data.selectedMonth,
                                    userId: SocketUserMap.get(socket.id)?.id,
                                    userDisplayName: SocketUserMap.get(
                                        socket.id
                                    )?.displayname,
                                })
                            }
                        }
                    }
                }
            )

            // Clean up the socket on disconnect
            socket.on('disconnect', () => {
                SocketUserMap.delete(socket.id)
                console.log(`Socket ${socket.id} disconnected.`)
            })
        })
        res.socket.server.io = io
    }
    res.end()
}
