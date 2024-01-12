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
  children?: ReactNode
  onSubmit: (dataset: DatasetCore) => void
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

export default function ShaclRenderer({
  settings,
  shaclShapesUrl,
  dataUrl,
  subject,
  children,
  onSubmit,
}: ShaclRendererProps) {
  const [dataDataset] = useState(() => datasetFactory.dataset())
  const [shaclDataset] = useState(() => datasetFactory.dataset())
  const [shaclShapes, setShaclShapes] = useState<GrapoiPointer>()
  const [dataPointer, setDataPointer] = useState<GrapoiPointer>()
  const [formChildren, setFormChildren] = useState<ReactNode>(null)

  useState(() => {
    if (shaclShapes || dataPointer) return

    return Promise.all([
      loadShaclShapes(settings, shaclDataset, shaclShapesUrl).then(setShaclShapes),
      loadData(settings, dataDataset, dataUrl, subject).then(setDataPointer),
    ])
  })

  useEffect(() => {
    if (shaclShapes && dataPointer && settings && !formChildren) {
      let shaclRoot = shaclShapes.hasOut(rdf('type'), sh('NodeShape'))
      if (settings.targetClass)
        shaclRoot = shaclRoot.hasOut(sh('targetClass'), DataFactory.namedNode(settings.targetClass))

      const matchedPointer = shaclRoot.ptrs.find((ptr) => ptr.term.value === shaclShapesUrl)
      shaclRoot.ptrs = [matchedPointer ?? shaclRoot.ptrs[0]]
      setFormChildren(
        <FormLevel isRoot={true} shaclPointer={shaclRoot} dataPointer={dataPointer} settings={settings} />
      )
    }
  }, [shaclShapes, dataPointer, settings, formChildren, shaclShapesUrl])

  const combinedChildren = (
    <>
      {formChildren}
      {children}
    </>
  )

  const formWrapper = (children: ReactNode) => (
    <div className={`shacl-renderer mode-${settings.mode}`}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(dataDataset)
        }}
      >
        {children}
      </form>
    </div>
  )

  return (
    <state.Provider value={{ data: dataDataset, shacl: shaclDataset }}>
      {settings.mode === 'edit' ? formWrapper(combinedChildren) : combinedChildren}
    </state.Provider>
  )
}
