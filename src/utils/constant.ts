export const ServerConfiguration = {
    SessionKeyName: 'UserTokenCookie',
}

export const FoodCompany = {
    ChingKee: 'ChingKee',
} as const

export const FoodCompanyInformation = [
    {
        Name: FoodCompany.ChingKee,
        Acceptance: '35261646.com.hk/products/',
        Prefix: 'https://www.35261646.com.hk/products/',
        activated: true,
    },
]

export const StaticPath = {
    HomePage: '/login',
    LoginedHomePage: '/ordering/account',
}

export const ConstantValue = {
    TotalBudget: 2000,
    OverBudgetPercentage: 0.1,
    MaximumProductNumber: 99,
    MaximumProductPrice: 3000,
}
