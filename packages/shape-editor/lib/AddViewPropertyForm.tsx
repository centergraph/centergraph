import { defaultSettings } from '@centergraph/shacl-renderer/lib/defaultSettings'
import { Suspense, useState } from 'react'
import { registerCoreWidgets } from '@centergraph/shacl-renderer/lib/helpers/registerWidgets'
import ShaclRenderer from '@centergraph/shacl-renderer'
import { sh } from '@centergraph/shared/lib/namespaces'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'

type AddPropertyFormProps = {
  close: () => void
  update: () => void
  shaclPointer: GrapoiPointer
}

export default function AddViewPropertyForm({ close, shaclPointer, update }: AddPropertyFormProps) {
  const [settings] = useState(() => {
    const settings = defaultSettings('edit')
    registerCoreWidgets(settings)

    const base = shaclPointer.term.value.split('#')[0]
    const basePointer = shaclPointer.node(factory.namedNode(base))
    const properties = basePointer.out(sh('property'))
    const shaclDataset = (settings.initialShaclDataset = datasetFactory.dataset())

    const subFormPointer = grapoi({ dataset: shaclDataset, factory })

    // Creates a field where the user has to select the form field it uses.
    subFormPointer.addOut(sh('property'), (propertyField: GrapoiPointer) => {
      propertyField.addOut(sh('name'), 'Property')
      propertyField.addOut(sh('description'), 'This specifies the sh:path')
      propertyField.addOut(sh('path'), sh('path'))
      propertyField.addOut(sh('minCount'), '1')
      propertyField.addOut(sh('maxCount'), '1')
      propertyField.addList(
        sh('in'),
        [...properties].map((property) => property.out(sh('path')).term)
      )
    })

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
                  subject={shaclPointer.term.value}
                  key={'add-view-property-form'}
                  onSubmit={(data) => {
                    const root = factory.blankNode()
                    const dataset = shaclPointer.ptrs[0].dataset
                    const quads = [...data]
                    for (const quad of quads)
                      dataset.add(
                        factory.quad(
                          quad.subject.equals(shaclPointer.term) ? root : quad.subject,
                          quad.predicate,
                          quad.object
                        )
                      )
                    dataset.add(factory.quad(shaclPointer.term, sh('property'), root))
                    console.log(quads, dataset)
                    close()
                    update()
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
