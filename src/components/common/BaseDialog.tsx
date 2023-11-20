import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

const Transition: React.ForwardRefExoticComponent<
    React.PropsWithRef<React.ComponentProps<'div'>>
> = React.forwardRef(function Transition(props, ref) {
    return (
        <Slide direction="up" ref={ref} {...props}>
            <div>{props.children}</div>
        </Slide>
    )
})

type BaseFormProps = {
    open: boolean
    handleClose: () => void
    loading?: boolean
    title: string
    onSubmitHandler?: () => void
    onCloseHandler?: () => void
    children: React.ReactNode
}

function BaseForm({
    open,
    handleClose,
    loading,
    title,
    onSubmitHandler,
    children,
}: BaseFormProps) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth={'lg'}
            fullWidth
            onClose={handleClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmitHandler && onSubmitHandler()
                }}
            >
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        color={'error'}
                        onClick={handleClose}
                        loading={loading}
                    >
                        Close
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        color={'primary'}
                        type={'submit'}
                        loading={loading}
                    >
                        Confirm
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default BaseForm
