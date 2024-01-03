import { registerWidgets } from './registerWidgets'
import { WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import { ReactElement } from 'react'
import grapoi from 'grapoi'
import { DataFactory, Parser } from 'n3'
import { schema } from './namespaces'
import datasetFactory from '@rdfjs/dataset'
import ContactShape from '@centergraph/shacl-renderer/lib/../public/shapes/contact.shacl.ttl?raw'

export const prepareTestState = async (mode: 'edit' | 'view') => {
  const loaders: Map<string, () => Promise<{ default: ReactElement }>> = new Map()
  const targetMetas: Array<WidgetMeta> = []

  const editorPromises = registerWidgets({
    targetMetas,
    loaders,
    metasGlob:
      mode === 'edit'
        ? import.meta.glob('@centergraph/shacl-renderer/lib/components/widgets/editors/*/meta.ts', { eager: true })
        : import.meta.glob('@centergraph/shacl-renderer/lib/components/widgets/viewers/*/meta.ts', { eager: true }),
    modulesGlob:
      mode === 'edit'
        ? import.meta.glob('@centergraph/shacl-renderer/lib/components/widgets/editors/*/index.tsx')
        : import.meta.glob('@centergraph/shacl-renderer/lib/components/widgets/viewers/*/index.tsx'),
  })

  await Promise.all(editorPromises)

  const quad = DataFactory.quad(DataFactory.namedNode(''), schema('name'), DataFactory.literal('John'))
  const dataset = datasetFactory.dataset([quad])
  const dataPointer = grapoi({ dataset, factory: DataFactory })

  const parser = new Parser()
  const quads = await parser.parse(ContactShape)
  const shaclDataset = datasetFactory.dataset(quads)
  const shaclPointer = grapoi({ dataset: shaclDataset, factory: DataFactory })
  return { dataPointer, shaclPointer, targetMetas, loaders, shaclDataset }
}
