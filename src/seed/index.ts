import { getPrisma } from '../utils/prisma'
import { UserSeedData, SeedData, SeedDataType } from '../types/seed'
import chalk from 'chalk'
import fs from 'fs'

const loadUser = async (userList: UserSeedData[]) => {
    for (const user of userList) {
        await getPrisma().user.create({
            data: {
                username: user.username,
                displayname: user.displayname,
                rank: user.isAdmin ? 'admin' : 'user',
                activated: true,
            },
        })
    }
}

const load = async () => {
    const files = fs.readdirSync('./src/seed/json')
    console.log(chalk.greenBright('Loading seed data...'))

    for (const file of files) {
        const seedHistory = await getPrisma().seedHistory.findFirst({
            where: {
                seedName: file,
            },
        })
        if (!seedHistory) {
            console.log(chalk.greenBright(`Seeding ${file}...`))

            const rawData = fs.readFileSync(`./src/seed/json/${file}`, 'utf-8')
            const seedData: SeedData = JSON.parse(rawData)
            switch (seedData.type) {
                case SeedDataType.user:
                    await loadUser(seedData.data)
                    break
            }

            await getPrisma().seedHistory.create({
                data: {
                    seedName: file,
                },
            })
            console.log(chalk.greenBright(`Seeded ${file} successfully!`))
        }
    }
}

load()
