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

const success = (message: string) => {
    toast.success(message, defaultToastConfig)
}

const error = (message: string) => {
    toast.error(message, defaultToastConfig)
}

const toastHelper = {
    success,
    error,
}

export default toastHelper
