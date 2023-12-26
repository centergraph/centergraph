import { writeTurtle } from './writeTurtle.ts'
import { Store, assertEquals, dataFactory } from '../deps.ts'
import { ex } from './namespaces.ts'
import { schema } from './namespaces.ts'

Deno.test('Test store with one quad', async () => {
  const store = new Store([dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'))])
  const turtle = await writeTurtle({ store })
  assertEquals(turtle, '<http://example.com/john> <https://schema.org/name> "John".\n')
})

Deno.test('Test empty store', async () => {
  const store = new Store()
  const turtle = await writeTurtle({ store })
  assertEquals(turtle, '')
})

Deno.test('Test broken store', async () => {
  try {
    /** @ts-expect-error */
    await writeTurtle({ store: null })
  } catch (error) {
    assertEquals(!!error, true)
  }
})
