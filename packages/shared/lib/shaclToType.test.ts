import { expect, test } from 'vitest'
import { shaclToType } from './shaclToType'

import { Parser } from 'n3'
import ContactShape from '../test-assets/contact.shacl.ttl?raw'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'

test('converting a SHACL shape to a TypeScript type', async () => {
  const parser = new Parser()
  const shaclQuads = await parser.parse(ContactShape)
  const context = {
    '@context': {
      '@vocab': 'https://schema.org/',
      schema: 'https://schema.org/',
    },
  }

  const shaclPointer = grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })

  const type = await shaclToType(shaclPointer, context, false)
  expect(
    `export type Person = {
    givenName: string;
    familyName: string;
    birthDate?: string;
    address?: {
        streetAddress: string;
        postalCode: string;
        addressLocality: string;
        addressRegion: string;
        addressCountry: string;
    }[];
};
`,
    type
  )
})
