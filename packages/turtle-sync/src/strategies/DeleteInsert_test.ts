import DeleteInsert from './DeleteInsert.ts'
import { assertEquals, dataFactory, Store } from '../deps.ts'
import { ex, schema } from '../helpers/namespaces.ts'

Deno.test('DeleteInsert strategy', async () => {
  const store = new Store()
  const quad = dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'), ex('john'))
  store.addQuad(quad)

  const iri = ex('john').value

  const sparqlEndpoint = 'http://localhost:3030/contents'

  await DeleteInsert({
    iri,
    sparqlEndpoint,
    store,
    file: {
      relativePath: '',
      contents: '',
    },
    graphStore: new Store([quad]),
    metadata: new Store(),
    fetch: (input: URL | Request | string, init?: RequestInit) => {
      return new Promise((resolve) => {
        assertEquals(init?.body?.toString().includes(`<${iri}>`), true)
        assertEquals(input, sparqlEndpoint)
        resolve(new Response())
      })
    },
  })

  assertEquals(store.size, 1)
})
