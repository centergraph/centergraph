import Ensure from './Ensure.ts'
import { assertEquals, dataFactory, Store } from '../deps.ts'
import { ex, schema } from '../helpers/namespaces.ts'

Deno.test('Ensure strategy with only a store', async () => {
  const store = new Store()
  const quad = dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'), ex('john'))

  const iri = ex('john').value
  assertEquals(store.size, 0)

  await Ensure({
    iri,
    store,
    file: {
      relativePath: '',
      contents: '',
    },
    graphStore: new Store([quad]),
    metadata: new Store(),
    fetch,
  })

  assertEquals(store.size, 1)
})

Deno.test('Ensure strategy with only a SPARQL endpoint', async () => {
  const store = new Store()
  const quad = dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'), ex('john'))
  store.addQuad(quad)

  const iri = ex('john').value

  const sparqlEndpoint = 'http://localhost:3030/contents'

  await Ensure({
    iri,
    sparqlEndpoint,
    file: {
      relativePath: '',
      contents: '',
    },
    graphStore: new Store([quad]),
    metadata: new Store(),
    fetch: (input: URL | Request | string, init?: RequestInit) => {
      return new Promise((resolve) => {
        if (init?.body?.toString().includes('ASK')) {
          assertEquals(init?.body?.toString().includes(`ASK`), true)
          assertEquals(init?.body?.toString().includes(`<${iri}>`), true)
          assertEquals(input, sparqlEndpoint)
        } else {
          assertEquals(init?.body?.toString().includes(`INSERT DATA`), true)
          assertEquals(init?.body?.toString().includes(`<${iri}>`), true)
          assertEquals(input, sparqlEndpoint)
        }
        resolve(
          new Response(
            JSON.stringify({
              boolean: false,
            })
          )
        )
      })
    },
  })
})

Deno.test('Ensure strategy with only a SPARQL endpoint with data existing', async () => {
  const store = new Store()
  const quad = dataFactory.quad(ex('john'), schema('name'), dataFactory.literal('John'), ex('john'))
  store.addQuad(quad)

  const iri = ex('john').value

  const sparqlEndpoint = 'http://localhost:3030/contents'

  await Ensure({
    iri,
    sparqlEndpoint,
    file: {
      relativePath: '',
      contents: '',
    },
    graphStore: new Store([quad]),
    metadata: new Store(),
    fetch: (input: URL | Request | string, init?: RequestInit) => {
      return new Promise((resolve) => {
        assertEquals(init?.body?.toString().includes(`ASK`), true)
        assertEquals(init?.body?.toString().includes(`<${iri}>`), true)
        assertEquals(input, sparqlEndpoint)
        resolve(
          new Response(
            JSON.stringify({
              boolean: true,
            })
          )
        )
      })
    },
  })
})
