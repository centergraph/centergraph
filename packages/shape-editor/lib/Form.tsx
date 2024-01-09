import ShaclRenderer from '@centergraph/shacl-renderer/lib/ShaclRenderer'
import datasetFactory from '@rdfjs/dataset'
import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import { SortableStateItem } from './ShapeEditor'
import { useEffect, useState } from 'react'
import { Settings } from '@centergraph/shacl-renderer/types'

export default function Form({ close, item }: { close: () => void; item: SortableStateItem }) {
  const [settings, setSettings] = useState<Settings>()

  useEffect(() => {
    const quads = item.pointer.distinct().out().quads()
    const settings = defaultSettings('edit')
    registerCoreWidgets(settings)

    settings.dataDataset = datasetFactory.dataset(quads)
    setSettings(settings)
  }, [item.pointer])

  return settings ? (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="btn-close" onClick={close} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ShaclRenderer settings={settings} shaclShapesUrl={`./shapes/${item.type}.shacl.ttl`} subject={item.pointer.term.value} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={close}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={close}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null
}
