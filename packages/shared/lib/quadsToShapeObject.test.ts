import { expect, test } from 'vitest'
import { quadsToShapeObject } from './quadsToShapeObject'
import { Parser } from 'n3'
import ContactShape from '../test-assets/contact.shacl.ttl?raw'
import JohnDoe from '../test-assets/john-doe.ttl?raw'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'

test('converting quads to a js object according to a SHACL shape', async () => {
  const parser = new Parser()
  const shaclQuads = await parser.parse(ContactShape)
  const dataQuads = await parser.parse(JohnDoe)
  const context = {
    '@context': {
      '@vocab': 'https://schema.org/',
      schema: 'https://schema.org/',
    },
  }

  const shaclPointer = grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })
  const dataPointer = grapoi({
    dataset: datasetFactory.dataset(dataQuads),
    factory,
    term: factory.namedNode('http://example.com/john-doe'),
  })

  const result = await quadsToShapeObject(shaclPointer, dataPointer, context)
  expect(result).toStrictEqual({
    familyName: 'Doe',
    givenName: 'John',
    birthDate: new Date('1947-01-14'),
    address: [
      {
        addressCountry: 'Austria',
        addressLocality: 'Wien',
        addressRegion: 'Wien',
        postalCode: '1220',
        streetAddress: 'Wagramer Strasse 5',
      },
    ],
  })
})
