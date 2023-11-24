export type UserListItem = {
    id: number
    username: string
    displayname: string
    rank: string
    activated: boolean // admin decide if disabling an account
    favFood: string
    birthday: string
    signed: boolean // whether the user has signed in once
}
