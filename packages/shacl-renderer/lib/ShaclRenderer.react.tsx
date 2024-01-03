import { ReactNode, useEffect, useState } from 'react'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import { Parser } from 'n3'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import FormLevel from '@centergraph/shacl-renderer/lib/components/core/FormLevel'
import { rdf, sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { DataFactory } from 'n3'
import { preloadWidgets } from './helpers/preloadWidgets'
import './style.css'

export type ShaclRendererProps = {
  settings: Settings
  shaclShapesUrl: string
  dataUrl?: string
  subject?: string
}

const loadShaclShapes = async (settings: Settings, shaclShapesUrl: string) => {
  const response = await settings.fetch(shaclShapesUrl).then((response) => response.text())
  const parser = new Parser()
  const quads = await parser.parse(response)
  settings.shaclDataset = datasetFactory.dataset(quads)
  const shaclShapes = grapoi({ dataset: settings.shaclDataset, factory: DataFactory })
  await preloadWidgets(settings, shaclShapes)
  return shaclShapes
}

const loadData = async (settings: Settings, dataUrl?: string, subject?: string) => {
  if (dataUrl) {
    const response = await settings.fetch(dataUrl).then((response) => response.text())
    const parser = new Parser({ baseIRI: dataUrl })
    const quads = await parser.parse(response)
    for (const quad of quads) settings.dataDataset.add(quad)
  }

  subject = subject ? subject : dataUrl

  if (!subject) throw new Error('A subject is required, either by the data-url or by the subject attribute')

  return grapoi({ dataset: settings.dataDataset, factory: DataFactory, term: DataFactory.namedNode(subject) })
}

export default function ShaclRenderer({ settings, shaclShapesUrl, dataUrl, subject }: ShaclRendererProps) {
  const [shaclShapes, setShaclShapes] = useState<GrapoiPointer>()
  const [dataPointer, setDataPointer] = useState<GrapoiPointer>()
  const [children, setChildren] = useState<ReactNode>(null)

  useEffect(() => {
    if (dataUrl && settings && shaclShapesUrl) {
      Promise.all([
        loadShaclShapes(settings, shaclShapesUrl).then(setShaclShapes),
        loadData(settings, dataUrl, subject).then(setDataPointer),
      ])
    }
  }, [dataUrl, settings, subject, shaclShapesUrl])

  useEffect(() => {
    if (shaclShapes && dataPointer && settings && !children) {
      let shaclRoot = shaclShapes.hasOut(rdf('type'), sh('NodeShape'))
      if (settings.targetClass) shaclRoot = shaclRoot.hasOut(sh('targetClass'), DataFactory.namedNode(settings.targetClass))
      shaclRoot.ptrs = [shaclRoot.ptrs[0]]
      setChildren(<FormLevel shaclPointer={shaclRoot} dataPointer={dataPointer} settings={settings} />)
    }
  }, [shaclShapes, dataPointer, settings, children])

  return children ? (
    <div className={`shacl-renderer mode-${settings.mode}`}>
      {settings.mode === 'edit' ? <form onSubmit={(event) => event.preventDefault()}>{children}</form> : children}
    </div>
  ) : null
}
