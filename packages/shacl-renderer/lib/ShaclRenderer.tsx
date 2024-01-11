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
import { DatasetCore } from '@rdfjs/types'
import { state } from './context/state'

export type ShaclRendererProps = {
  settings: Settings
  shaclShapesUrl?: string
  dataUrl?: string
  subject?: string
}

const loadShaclShapes = async (settings: Settings, dataset: DatasetCore, shaclShapesUrl?: string) => {
  if (shaclShapesUrl) {
    const response = await settings.fetch(shaclShapesUrl.split('#')[0]).then((response) => response.text())
    const parser = new Parser()
    const quads = await parser.parse(response)
    for (const quad of quads) dataset.add(quad)
  }
  const shaclShapes = grapoi({ dataset, factory: DataFactory })
  await preloadWidgets(settings, shaclShapes)
  return shaclShapes
}

const loadData = async (settings: Settings, dataset: DatasetCore, dataUrl?: string, subject?: string) => {
  if (dataUrl) {
    const response = await settings.fetch(dataUrl.split('#')[0]).then((response) => response.text())
    const parser = new Parser({ baseIRI: dataUrl })
    const quads = await parser.parse(response)
    for (const quad of quads) dataset.add(quad)
  }

  subject = subject ? subject : dataUrl

  if (!subject) throw new Error('A subject is required, either by the data-url or by the subject attribute')

  return grapoi({ dataset, factory: DataFactory, term: DataFactory.namedNode(subject) })
}

export default function ShaclRenderer({ settings, shaclShapesUrl, dataUrl, subject }: ShaclRendererProps) {
  const [dataDataset] = useState(() => datasetFactory.dataset())
  const [shaclDataset] = useState(() => datasetFactory.dataset())
  const [shaclShapes, setShaclShapes] = useState<GrapoiPointer>()
  const [dataPointer, setDataPointer] = useState<GrapoiPointer>()
  const [children, setChildren] = useState<ReactNode>(null)

  useState(() => {
    if (shaclShapes || dataPointer) return

    return Promise.all([
      loadShaclShapes(settings, shaclDataset, shaclShapesUrl).then(setShaclShapes),
      loadData(settings, dataDataset, dataUrl, subject).then(setDataPointer),
    ])
  })

  useEffect(() => {
    if (shaclShapes && dataPointer && settings && !children) {
      let shaclRoot = shaclShapes.hasOut(rdf('type'), sh('NodeShape'))
      if (settings.targetClass)
        shaclRoot = shaclRoot.hasOut(sh('targetClass'), DataFactory.namedNode(settings.targetClass))

      const matchedPointer = shaclRoot.ptrs.find((ptr) => ptr.term.value === shaclShapesUrl)
      shaclRoot.ptrs = [matchedPointer ?? shaclRoot.ptrs[0]]
      setChildren(<FormLevel shaclPointer={shaclRoot} dataPointer={dataPointer} settings={settings} />)
    }
  }, [shaclShapes, dataPointer, settings, children, shaclShapesUrl])

  return (
    <state.Provider value={{ data: dataDataset, shacl: shaclDataset }}>
      {children ? (
        <div className={`shacl-renderer mode-${settings.mode}`}>
          {settings.mode === 'edit' ? <form onSubmit={(event) => event.preventDefault()}>{children}</form> : children}
        </div>
      ) : null}
    </state.Provider>
  )
}
