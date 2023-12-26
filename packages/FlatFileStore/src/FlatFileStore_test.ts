import { FlatFileStore } from './FlatFileStore.ts'
import { DenoFolderAdapter } from './adapters/DenoFolderAdapter.ts'
import { TestFolderAdapter } from './adapters/TestFolderAdapter.ts'
import { assertEquals, dataFactory } from './deps.ts'
import { ex, rdfs, schema } from './core/helpers/namespaces.ts'

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

Deno.test('Test store with folder', async () => {
  const store = new FlatFileStore({
    removeExtensions: true,
    folderAdapter: new DenoFolderAdapter(`${Deno.cwd()}/test-data`),
    base: 'http://example.com/',
  })

  await store.ready

  assertEquals(store.size > 63, true)
  const graphs = store
    .getGraphs(null, null, null)
    .map((term) => term.value)
    .filter((graph) => graph.includes('/shapes'))

  assertEquals(graphs, ['http://example.com/shapes/', 'http://example.com/shapes/contact.shacl'])
})

Deno.test('Test store with stub', async () => {
  const store = new FlatFileStore({
    removeExtensions: true,
    folderAdapter: new TestFolderAdapter(),
    base: 'http://example.com/',
  })

  await store.ready

  assertEquals(store.size >= 60, true)
  const graphs = store.getGraphs(null, null, null).map((term) => term.value)
  assertEquals(graphs, ['http://example.com/shapes/contact.shacl'])
})

Deno.test('Test a quad transform', async () => {
  const store = new FlatFileStore({
    base: 'http://example.com/',
    removeExtensions: true,
  })

  const quad = dataFactory.quad(ex('shapes/'), rdfs('name'), dataFactory.literal('test'))

  const transformedQuad = store.transformQuad(quad, {
    fullPath: '',
    relativePath: `shapes/index.ttl`,
    contents: '',
  })

  assertEquals(transformedQuad.graph.equals(ex('shapes/')), true)

  const transformedQuad2 = store.transformQuad(quad, {
    fullPath: '',
    relativePath: `shapes/test`,
    contents: '',
  })

  assertEquals(transformedQuad2.graph.equals(ex('shapes/test')), true)

  const store2 = new FlatFileStore({
    base: 'http://example.com/',
    removeExtensions: false,
  })

  const transformedQuad3 = store2.transformQuad(quad, {
    fullPath: '',
    relativePath: `shapes/test.ttl`,
    contents: '',
  })

  assertEquals(transformedQuad3.graph.equals(ex('shapes/test.ttl')), true)

  const store3 = new FlatFileStore({
    removeExtensions: false,
  })

  const transformedQuad4 = store3.transformQuad(quad, {
    fullPath: '',
    relativePath: `shapes`,
    contents: '',
  })

  assertEquals(transformedQuad4.graph.value, 'shapes')
})

Deno.test('Test store without data', async () => {
  const store = new FlatFileStore({
    base: 'http://example.com/',
  })

  await store.ready

  store.parseData()
  assertEquals(store.size, 0)
})
