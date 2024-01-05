import { expect, test } from 'vitest'
import datasetFactory from '@rdfjs/dataset'
import { Parser } from 'n3'
import ContactShape from '../../public/shapes/contact.shacl.ttl?raw'
import { getAllShapesFromShape } from './getAllShapesFromShape'
import grapoi from 'grapoi'
import factory from '@rdfjs/data-model'

test('it gets all the nested shapes', async () => {
  const parser = new Parser()

  const quads = await parser.parse(ContactShape)
  const dataset = datasetFactory.dataset(quads)
  const pointer = grapoi({ dataset, factory })
  const shapeIris = getAllShapesFromShape(pointer, factory.namedNode(''))
  expect(shapeIris.map((i) => i.value)).toStrictEqual(['', 'addressShape'])
})
