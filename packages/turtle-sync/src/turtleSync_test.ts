import { TestFolderAdapter } from './adapters/TestFolderAdapter_test.ts'
import { Store, assertEquals } from './deps.ts'
import turtleSync from './turtleSync.ts'

Deno.test('Test empty store', async () => {
  const store = new Store()
  await turtleSync({
    store,
    baseIRI: 'http://example.com/',
    folderAdapter: new TestFolderAdapter(),
  })

  assertEquals(store.size > 30, true)
})

Deno.test('Test parse error on SHACL shape', async () => {
  const store = new Store()

  try {
    await turtleSync({
      store,
      baseIRI: 'http://example.com/',
      folderAdapter: new TestFolderAdapter(undefined, {
        relativePath: `shapes/broken`,
        contents: '',
      }),
    })
  } catch (error) {
    assertEquals(error.message, 'The SHACL shape shapes/broken could not be parsed.')
  }
})

Deno.test('Test parse error on data', async () => {
  const store = new Store()

  const errors = await turtleSync({
    store,
    baseIRI: 'http://example.com/',
    folderAdapter: new TestFolderAdapter({
      relativePath: `shapes/broken`,
      contents: '<>',
    }),
  })

  assertEquals({ 'shapes/broken': ['Expected entity but got eof on line 1.'] }, errors)
})

Deno.test('Test shacl validation error store', async () => {
  const store = new Store()

  const errors = await turtleSync({
    store,
    baseIRI: 'http://example.com/',
    folderAdapter: new TestFolderAdapter({
      relativePath: `shapes/invalid`,
      contents: `
      @prefix schema: <https://schema.org/> .

      <>
        a schema:Person ;
        schema:givenName "Eddy" .        
      `,
    }),
  })

  assertEquals(
    {
      'shapes/invalid': ['https://schema.org/familyName: Less than 1 values'],
    },
    errors
  )
})
