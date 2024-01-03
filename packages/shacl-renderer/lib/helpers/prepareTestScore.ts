import ContactShape from '@centergraph/shacl-renderer/lib/../public/shapes/contact.shacl.ttl?raw'
import { DataFactory, Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import JohnDoe from '@centergraph/shacl-renderer/lib/../public/john-doe.ttl?raw'
import { rdf, sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { NamedNode } from '@rdfjs/types'

export const prepareScoreTest = async (predicate: NamedNode) => {
  const parser = new Parser()
  const quads1 = await parser.parse(JohnDoe)
  const dataDataset = datasetFactory.dataset(quads1)
  const allDataPointer = grapoi({ dataset: dataDataset, factory: DataFactory })

  const quads2 = await parser.parse(ContactShape)
  const shaclDataset = datasetFactory.dataset(quads2)
  const allShaclPointer = grapoi({ dataset: shaclDataset, factory: DataFactory })

  const shaclPointer = allShaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), predicate).value)

  const dataPointer = allDataPointer.out(predicate)

  return { dataPointer, shaclPointer }
}
