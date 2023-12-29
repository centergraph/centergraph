import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import ContactShape from '@/../public/shapes/contact.shacl.ttl?raw'
import LiteralViewer from '.'
import { DataFactory, Parser } from 'n3'
import { Term } from '@rdfjs/types'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import JohnDoe from '@/../public/john-doe.ttl?raw'
import { Settings } from '@/types'
import defaultCssClasses from '@/defaultCssClasses'
import { createElement } from 'react'

test('it renders a span', async () => {
  const term = DataFactory.literal('Lorem')
  const setTerm = (term: Term) => term

  const parser = new Parser()
  const quads1 = await parser.parse(JohnDoe)
  const dataDataset = datasetFactory.dataset(quads1)
  const dataPointer = grapoi({ dataset: dataDataset, factory: DataFactory })

  const quads2 = await parser.parse(ContactShape)
  const shaclDataset = datasetFactory.dataset(quads2)
  const shaclPointer = grapoi({ dataset: shaclDataset, factory: DataFactory })

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: [],
    },
    widgetLoaders: new Map(),
    dataDataset: datasetFactory.dataset(),
    shaclDataset: datasetFactory.dataset(),
    cssClasses: defaultCssClasses('edit'),
  }

  const output = render(
    createElement(LiteralViewer, {
      term,
      setTerm,
      shaclPointer,
      dataPointer,
      settings,
    })
  )

  expect(output.baseElement.children[0].innerHTML).toBe('<span>Lorem</span>')
})
