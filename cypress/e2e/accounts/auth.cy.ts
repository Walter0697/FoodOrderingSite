describe('Authentication', () => {
    it('should login with the right credential', () => {
        cy.visit('localhost:3000/login')

        cy.fixture('accounts').then(async (account: UserData[]) => {
            const wrongInput = account.find((a) => a.correct === false)
            if (!wrongInput) {
                throw new Error('No wrong input found')
            }
            cy.get('.username').type(wrongInput.username)
            cy.get('.password').type(wrongInput.password)
            cy.get('#loginBtn').click()

            // expect a toast with wrong information show up
            const InvalidText = 'Invalid username or password'
            cy.contains(InvalidText).should('exist')

            cy.get('.username').clear()
            cy.get('.password').clear()

            // await for one second for the toast to disappear
            cy.wait(1000)

            const adminAccount = account.find(
                (a) => a.username === 'admin' && a.correct === true
            )
            if (!adminAccount) {
                throw new Error('No admin account found')
            }

            cy.get('.username').type(adminAccount.username)
            cy.get('.password').type(adminAccount.password)
            cy.get('#loginBtn').click()

            cy.wait(1000)

            // expect link to be any /ordering page
            cy.url().should('include', '/ordering')
        })
    })
})
