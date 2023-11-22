import { describe, expect, test } from 'vitest'
import { balanceWeight } from '@/utils/list'

describe('balance weight', () => {
    test('should return null for positive balance', () => {
        const result = balanceWeight(1999)
        expect(result).toBe(null)
    })

    test('should return null for overflowing first segment', () => {
        const result = balanceWeight(-10)
        expect(result).toBe(null)
    })

    test('should return 100 for overflowing second segment', () => {
        const result = balanceWeight(-20)
        expect(result).toBe('100')
    })

    test('should return 500 for overflowing sixth segment', () => {
        const result = balanceWeight(-100)
        expect(result).toBe('500')
    })
})
