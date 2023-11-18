import { describe, expect, test } from 'vitest'
import { faker } from '@faker-js/faker'

import {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
} from '@/utils/auth'
import { verify } from 'crypto'
import { User } from '@prisma/client'

describe('hash and compare password', () => {
    test('should return true for the correct password', async () => {
        const password = faker.string.uuid()
        const hash = await hashPassword(password)
        const result = await comparePassword(password, hash)
        expect(result).toBe(true)
    })

    test('should return false for the incorrect password', async () => {
        const password = faker.string.uuid()
        const hash = await hashPassword(password)
        const result = await comparePassword(faker.string.uuid(), hash)
        expect(result).toBe(false)
    })
})

describe('jwt token information', () => {
    test('should return the correct information', async () => {
        const user: User = {
            id: faker.number.int(),
            username: faker.internet.userName(),
            displayname: faker.person.firstName(),
            rank: faker.string.sample(),
            activated: true,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
            extraInformation: null,
            password: null,
            deletedAt: null,
        }
        const token = await generateToken(user)
        const info = await verifyToken(token)
        expect(info.id).toBe(user.id)
        expect(info.username).toBe(user.username)
        expect(info.rank).toBe(user.rank)
    })
})
