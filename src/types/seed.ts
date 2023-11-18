export type UserSeedData = {
    username: string
    displayname: string
    isAdmin: boolean
}

export const SeedDataType = {
    user: 'user',
} as const

export type SeedData = {
    type: keyof typeof SeedDataType
} & UserSeedDataList

export type UserSeedDataList = {
    type: 'user'
    data: UserSeedData[]
}
