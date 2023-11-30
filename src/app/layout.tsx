import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ToastProvider from '@/provider/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Food Ordering',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <body className={inter.className}>
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    )
}
