import { expect, test } from 'vitest'
import { lastPart } from './lastPart'
import { DataFactory } from 'n3'

test('it gets the last part of a string', () => {
  expect(lastPart('https://example.com/test#lorem')).toBe('lorem')
})

test('it gets the last part of a Literal', () => {
  expect(lastPart(DataFactory.namedNode('https://example.com/test#lorem'))).toBe('lorem')
})
