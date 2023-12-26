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
const stubbedResponse1 = {
  head: { vars: ['g'] },
  results: {
    bindings: [
      {
        g: {
          type: 'uri',
          value: 'http://example.com/shapes/contact.shacl',
        },
      },
    ],
  },
}

const stubbedResponse2 = `<http://example.com/shapes/addressShape>
a       <http://www.w3.org/ns/shacl#NodeShape>;
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Country"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/addressCountry>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Postal code"@en;
          <http://www.w3.org/ns/shacl#or>
                  ( [ <http://www.w3.org/ns/shacl#datatype>
                              <http://www.w3.org/2001/XMLSchema#string> ]
                    [ <http://www.w3.org/ns/shacl#datatype>
                              <http://www.w3.org/2001/XMLSchema#number> ]
                  );
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/postalCode>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Locality"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/addressLocality>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Region"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/addressRegion>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Street"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/streetAddress>
        ];
<http://www.w3.org/ns/shacl#targetClass>
        <https://schema.org/PostalAddress> .

<http://example.com/shapes/contact.shacl>
a       <http://www.w3.org/ns/shacl#NodeShape>;
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Address"@en;
          <http://www.w3.org/ns/shacl#node>
                  <http://example.com/shapes/addressShape>;
          <http://www.w3.org/ns/shacl#nodeKind>
                  <http://www.w3.org/ns/shacl#BlankNode>;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/address>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#group>
                  "name";
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Family name"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/familyName>
        ];
<http://www.w3.org/ns/shacl#property>
        [ <http://www.w3.org/ns/shacl#datatype>
                  <http://www.w3.org/2001/XMLSchema#string>;
          <http://www.w3.org/ns/shacl#group>
                  "name";
          <http://www.w3.org/ns/shacl#maxCount>
                  1;
          <http://www.w3.org/ns/shacl#minCount>
                  1;
          <http://www.w3.org/ns/shacl#name>
                  "Given name"@en;
          <http://www.w3.org/ns/shacl#path>
                  <https://schema.org/givenName>
        ];
<http://www.w3.org/ns/shacl#targetClass>
        <https://schema.org/Person> .
`

Deno.test('shapes fetching from endpoint', async () => {
  const shaclStore = new Store()

  try {
    await turtleSync({
      shaclStore,
      sparqlEndpoint: 'http://localhost:3030/contents',
      baseIRI: 'http://example.com/',
      folderAdapter: new TestFolderAdapter(undefined, {
        relativePath: `shapes/broken`,
        contents: '',
      }),
      fetch: (input: URL | Request | string, init?: RequestInit) => {
        return new Promise((resolve) => {
          resolve(new Response(init?.body?.toString().includes('SELECT') ? JSON.stringify(stubbedResponse1) : stubbedResponse2))
        })
      },
    })
  } catch (error) {}

  assertEquals(shaclStore.size, 60)
})

Deno.test('shapes fetching from endpoint and added shapes', async () => {
  const shaclStore = new Store()

  try {
    await turtleSync({
      shaclStore,
      sparqlEndpoint: 'http://localhost:3030/contents',
      baseIRI: 'http://example.com/',
      folderAdapter: new TestFolderAdapter(undefined, {
        relativePath: `shapes/broken`,
        contents: '',
      }),
      fetch: (input: URL | Request | string, init?: RequestInit) => {
        return new Promise((resolve) => {
          resolve(new Response(init?.body?.toString().includes('SELECT') ? JSON.stringify(stubbedResponse1) : stubbedResponse2))
        })
      },
    })
  } catch (error) {}

  assertEquals(shaclStore.size, 60)
})

Deno.test('unstubbed fetch', async () => {
  const shaclStore = new Store()

  try {
    await turtleSync({
      shaclStore,
      sparqlEndpoint: 'http://unknown',
      baseIRI: 'http://example.com/',
      folderAdapter: new TestFolderAdapter(undefined, {
        relativePath: `shapes/broken`,
        contents: '',
      }),
    })
  } catch (error) {}

  assertEquals(shaclStore.size, 0)
})
