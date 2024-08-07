export const ServerConfiguration = {
    SessionKeyName: 'UserTokenCookie',
}

export const FoodCompany = {
    ChingKee: 'ChingKee',
    ParknShop: 'ParknShop',
    Wellcome: 'Wellcome',
} as const

export const FoodCompanyInformation = [
    {
        Name: FoodCompany.ChingKee,
        ChineseName: '正記',
        Website: 'https://www.35261646.com.hk/',
        Acceptance: '35261646.com.hk/products/',
        Prefix: 'https://www.35261646.com.hk/products/',
        activated: true,
    },
    {
        Name: FoodCompany.ParknShop,
        ChineseName: '百佳',
        Website: 'https://www.pns.hk/',
        Acceptance: 'www.pns.hk/',
        Prefix: 'https://www.pns.hk/',
        activated: true,
    },
    {
        Name: FoodCompany.Wellcome,
        ChineseName: '惠康',
        Website: 'https://www.wellcome.com.hk/',
        Acceptance: 'www.wellcome.com.hk/',
        Prefix: 'https://www.wellcome.com.hk/',
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
