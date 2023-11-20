'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getCurrentMonthIdentifier } from '@/utils/month'

const Dashboard = () => {
    const router = useRouter()

    // redirect to the current month
    useEffect(() => {
        const currentMonth = getCurrentMonthIdentifier()
        router.push(`/ordering/dashboard/${currentMonth}`)
    }, [router])

    return false
}

export default Dashboard
