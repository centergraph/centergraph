import { rdfs, schema, sh } from '../../helpers/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings } from '../../types'
import PropertyObject from './PropertyObject'
import { DataFactory } from 'n3'
import { useCallback, useEffect, useState } from 'react'
import { useWidget } from '../../hooks/useWidget'
import { Term } from '@rdfjs/types'
import { lastPart } from '../../helpers/lastPart'

type ShaclPropertyProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
}

export default function ShaclProperty({ shaclPointer, dataPointer, settings }: ShaclPropertyProps) {
  const path = parsePath(shaclPointer.out(sh('path')))
  const label = shaclPointer.out([rdfs('label'), sh('name'), schema('name')]).values?.[0]
  const { widgetMeta } = useWidget(settings, dataPointer, shaclPointer)

  // When a child renders we must render the shacl property so that it the dataPointer is updated as these are stateful.
  const [objectPointers, setRealObjectPointers] = useState(dataPointer.executeAll(path))
  const setObjectPointers = useCallback(() => setRealObjectPointers(dataPointer.executeAll(path)), [dataPointer, path])

  // Add an empty value so an empty widget displays for simple property paths
  useEffect(() => {
    if (!widgetMeta) return

    if (settings.mode === 'edit' && !dataPointer.executeAll(path).ptrs.length && path.length === 1 && path[0].predicates?.length === 1) {
      dataPointer.addOut(path[0].predicates[0], widgetMeta.createTerm ? widgetMeta.createTerm() : DataFactory.literal(''))
      setObjectPointers()
    }
  }, [widgetMeta, dataPointer, path, settings.mode, shaclPointer, setObjectPointers])

  // Sometimes the whole of the property can be hidden.
  const alternativePredicates = path[0].predicates
  const maxCount = shaclPointer.out(sh('maxCount')).value ? parseInt(shaclPointer.out(sh('maxCount')).value) : Infinity

  const shouldShow = widgetMeta && (!!objectPointers.ptrs.length || settings.mode === 'edit')

  return shouldShow ? (
    <div className="property mb-3">
      {/* The label of the field */}
      {label ? (
        <label className={`form-label ${settings.mode === 'view' ? 'd-inline' : ''}`}>
          {label}
          {settings.mode === 'view' ? ': ' : ''}
        </label>
      ) : null}

      {/* Alternative predicates like schema:name | rdfs:label */}
      {alternativePredicates?.length > 1 && [...objectPointers].length < maxCount
        ? alternativePredicates.map((predicate: Term) => (
            <button
              onClick={() => {
                dataPointer.addOut(predicate, widgetMeta?.createTerm ? widgetMeta.createTerm() : DataFactory.literal(''))
                setObjectPointers()
              }}
              className="btn btn-sm btn-secondary ms-2"
              key={predicate.value}
              title={predicate.value}
            >
              + {lastPart(predicate)}
            </button>
          ))
        : null}

      {/* The rendering of the widget happens inside the PropertyObject */}
      {[...objectPointers].map((objectPointer) => (
        <PropertyObject
          key={objectPointer?.term}
          setObjectPointers={setObjectPointers}
          dataPointer={objectPointer}
          shaclPointer={shaclPointer}
          settings={settings}
        />
      ))}
    </div>
  ) : null
}