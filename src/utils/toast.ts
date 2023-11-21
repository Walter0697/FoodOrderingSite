'use client'

import { ToastOptions, toast } from 'react-toastify'

const defaultToastConfig: Partial<ToastOptions> = {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
}

const cartUpdateToastConfig: Partial<ToastOptions> = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
}

const success = (message: string) => {
    toast.success(message, defaultToastConfig)
}

const error = (message: string) => {
    toast.error(message, defaultToastConfig)
}

const cartUpdate = (message: string) => {
    toast(`🛒 ${message}`)
}

const toastHelper = {
    success,
    error,
    cartUpdate,
}

export default toastHelper
