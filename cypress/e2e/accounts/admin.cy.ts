const AdminOnlyRoutes = ['User List']

describe('Admin Authorization', () => {
    it('should hide the correct navigation for non admin', () => {
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
            for (let i = 0; i < AdminOnlyRoutes.length; i++) {
                cy.contains(AdminOnlyRoutes[i]).should('exist')
            }

            cy.get('.MuiModal-backdrop').click()
            cy.wait(500)

            cy.get('#logoutBtn').click()

            cy.wait(1000)

            cy.url().should('include', '/login')

            const nonAdminAccount = account.find(
                (a) => a.username !== 'admin' && a.correct === true
            )

            if (!nonAdminAccount) {
                throw new Error('No non-admin account found')
            }
            cy.get('.username').type(nonAdminAccount.username)
            cy.get('.password').type(nonAdminAccount.password)
            cy.get('#loginBtn').click()

            // expect link to be any /ordering page
            cy.url().should('include', '/ordering')

            cy.get('#sideMenuBtn').click()
            for (let i = 0; i < AdminOnlyRoutes.length; i++) {
                cy.contains(AdminOnlyRoutes[i]).should('not.exist')
            }
        })
    })
})
