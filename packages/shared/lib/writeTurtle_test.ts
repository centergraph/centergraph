import { DataFactory, Store } from 'n3'
import { expect, test } from 'vitest'

import { ex } from './namespaces.ts'
import { schema } from './namespaces.ts'
import { writeTurtle } from './writeTurtle.ts'

test('Test store with one quad', async () => {
  const store = new Store([DataFactory.quad(ex('john'), schema('name'), DataFactory.literal('John'))])
  const turtle = await writeTurtle({ store })
  expect(turtle).toBe(
    `
<http://example.com/john> <https://schema.org/name> "John" .\n`
  )
})

test('Test empty store', async () => {
  const store = new Store()
  const turtle = await writeTurtle({ store })
  expect(turtle).toBe('\n')
})

test('Test broken store', async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-expect-error */
    await writeTurtle({ store: null })
  } catch (error) {
    expect(!!error).toBe(true)
  }
})
