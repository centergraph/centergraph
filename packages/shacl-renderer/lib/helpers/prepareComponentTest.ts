import ContactShape from '@centergraph/shacl-renderer/lib/../public/shapes/contact.shacl.ttl?raw'
import { DataFactory, Parser } from 'n3'
import { Term } from '@rdfjs/types'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import JohnDoe from '@centergraph/shacl-renderer/lib/../public/john-doe.ttl?raw'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import defaultCssClasses from '@centergraph/shacl-renderer/lib/defaultCssClasses'

export const prepareComponentTest = async () => {
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

  return {
    setTerm,
    dataPointer,
    shaclPointer,
    settings,
  }
}
