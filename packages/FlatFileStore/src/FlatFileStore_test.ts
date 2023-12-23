import { FlatFileStore } from './FlatFileStore.ts'
import { assertEquals, dataFactory, namespace } from './deps.ts'

const schema = namespace('https://schema.org/')
const ex = namespace('http://example/')

Deno.test('Test empty store', () => {
  const store = new FlatFileStore()
  assertEquals(store.size, 0)
})

Deno.test('Test store with quads', () => {
  const store = new FlatFileStore()
  store.add(dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John')))
  store.add(dataFactory.quad(ex('frank'), schema('name'), dataFactory.literal('Frank')))
  assertEquals(store.size, 2)
})

Deno.test('Test store with folder', () => {
  const store = new FlatFileStore()
  assertEquals(store.size, 0)
})
