import type { Server as HTTPServer } from 'http'
import type { NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'
import { SocketActionType } from './enum'

export interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

export interface SocketWithIO extends NetSocket {
    server: SocketServer
}

export interface NextApiResponseWithSocket<T> extends NextApiResponse<T> {
    socket: SocketWithIO
}

export type SocketCreateAction = {
    actionType: SocketActionType.Create
    unitPrice: number
    quantity: number
    type: string
}

export type SocketUpdateAction = {
    actionType: SocketActionType.Update
    unitPrice: number
    quantity: number
    type: string
}

export type SocketDeleteAction = {
    actionType: SocketActionType.Remove
}

export type SocketActionData = {
    userId: number
    userDisplayName: string
    productName: string
    productIdentifier: string
    orderId: number
    selectedMonth: string
} & (SocketCreateAction | SocketUpdateAction | SocketDeleteAction)
