import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { Suspense, useState } from 'react'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import ShaclRenderer from '@centergraph/shacl-renderer'

type AddPropertyFormProps = {
  close: () => void
}

export default function AddFormPropertyForm({ close }: AddPropertyFormProps) {
  const [settings] = useState(() => {
    const settings = defaultSettings('edit')
    registerCoreWidgets(settings)
    return settings
  })

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"></h5>
              <button type="button" className="btn-close" onClick={close} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Suspense>
                <ShaclRenderer
                  key={'add-form-property-form'}
                  onSubmit={(data) => {
                    console.log(data)
                  }}
                  settings={settings}
                  shaclShapesUrl={`./shapes/property.shacl.ttl`}
                >
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={close}>
                      Close
                    </button>
                    <button className="btn btn-primary" onClick={() => {}}>
                      Save changes
                    </button>
                  </div>
                </ShaclRenderer>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
