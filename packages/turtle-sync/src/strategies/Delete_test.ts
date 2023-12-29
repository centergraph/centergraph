import { assertEquals, dataFactory, Store } from '../deps.ts'
import { ex, schema } from '../helpers/namespaces.ts'
import Delete from './Delete.ts'

Deno.test('Delete strategy', async () => {
  const store = new Store()
  store.addQuad(dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'), ex('john')))

  const iri = ex('john').value

  const sparqlEndpoint = 'http://localhost:3030/contents'

  await Delete({
    iri,
    sparqlEndpoint,
    store,
    file: {
      relativePath: '',
      contents: '',
    },
    graphStore: new Store(),
    metadata: new Store(),
    fetch: (input: URL | Request | string, init?: RequestInit) => {
      return new Promise((resolve) => {
        assertEquals(init?.body?.toString().includes(`<${iri}>`), true)
        assertEquals(input, sparqlEndpoint)
        resolve(new Response())
      })
    },
  })

  assertEquals(store.size, 0)
})
