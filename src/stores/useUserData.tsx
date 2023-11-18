import { UserSessionData } from '@/types/session'
import { create } from 'zustand'

interface UserDataSlice {
    userData: UserSessionData | null
    setUserData: (userData: UserSessionData) => void
}

const useUserData = create<UserDataSlice>()((set) => {
    return {
        userData: null,
        setUserData: (userData: UserSessionData) => {
            set({ userData })
        },
    }
})

export default useUserData
