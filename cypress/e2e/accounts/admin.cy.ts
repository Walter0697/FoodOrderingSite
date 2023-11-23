describe('Admin Authorization', () => {
    it('should show the correct navigation for admin', () => {
        cy.visit('localhost:3000/login')

        cy.fixture('accounts').then(async (account: UserData[]) => {
            const adminAccount = account.find(
                (a) => a.username === 'admin' && a.correct === true
            )

            if (!adminAccount) {
                throw new Error('No admin account found')
            }
            cy.get('.username').type(adminAccount.username)
            cy.get('.password').type(adminAccount.password)
            cy.get('#loginBtn').click()

            // expect link to be any /ordering page
            cy.url().should('include', '/ordering')

            cy.get('#sideMenuBtn').click()
            const AdminOnlyRoutes = ['User List']
            for (let i = 0; i < AdminOnlyRoutes.length; i++) {
                cy.contains(AdminOnlyRoutes[i]).should('exist')
            }
        })
    })
})
