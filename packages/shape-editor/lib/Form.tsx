import ShaclRenderer from '@centergraph/shacl-renderer/lib/ShaclRenderer'
import datasetFactory from '@rdfjs/dataset'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import { SortableStateItem } from './ShapeEditor'
import { useEffect, useState } from 'react'
import { Settings, WidgetMeta } from '@centergraph/shacl-renderer/lib/types'
import DatasetCore from '@rdfjs/dataset/DatasetCore'
import { dash, rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { Parser } from 'n3'

export default function Form({
  close,
  item,
  widgetMetas,
}: {
  close: () => void
  item: SortableStateItem
  widgetMetas?: Array<WidgetMeta>
}) {
  const [settings, setSettings] = useState<Settings>()
  const [shaclShapesUrl, setShaclShapesUrl] = useState<string | undefined>(undefined)
  const [ready, setReady] = useState<boolean>(false)

  const label =
    item.pointer.out([sh('name'), rdfs('label'), schema('name')]).values[0] ??
    item.pointer?.term.id.split(/\/|#/g).pop() ??
    'undefined'

  useEffect(() => {
    const quads = item.pointer.distinct().out().quads()
    const settings = defaultSettings('edit')
    registerCoreWidgets(settings)

    settings.initialDataDataset = datasetFactory.dataset(quads)
    setSettings(settings)

    const widgetMeta = widgetMetas?.find((widgetMeta) => widgetMeta.iri.equals(item.pointer.out(dash('editor')).term))

    if (widgetMeta?.formParts?.length) {
      const shaclDataset = datasetFactory.dataset()
      settings.initialShaclDataset = shaclDataset
      const parser = new Parser()

      fetch(`./shapes/${item.type}.shacl.ttl`)
        .then((response) => response.text())
        .then(async (shaclTurtle) => {
          const promises = [...(widgetMeta!.formParts ?? []), shaclTurtle].map(async (shaclTurtle) => {
            const quads = await parser.parse(shaclTurtle)
            for (const quad of quads) shaclDataset.add(quad)
          })

          await Promise.all(promises)

          setReady(true)
          return
        })
    } else {
      setShaclShapesUrl(`./shapes/${item.type}.shacl.ttl`)
      setReady(true)
    }
  }, [item.pointer, item.type, widgetMetas])

  return settings && ready ? (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit {item.type === 'group' ? 'group' : 'property'} {label}
              </h5>
              <button type="button" className="btn-close" onClick={close} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ShaclRenderer settings={settings} shaclShapesUrl={shaclShapesUrl} subject={item.pointer.term.value} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={close}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const dataset = item.pointer.ptrs[0].dataset as DatasetCore
                  const oldQuads = item.pointer.distinct().out().quads()

                  for (const oldQuad of oldQuads) dataset.delete(oldQuad)
                  for (const quad of [...settings.dataDataset]) {
                    if (quad.object.value) dataset.add(quad)
                  }

                  close()
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null
}
