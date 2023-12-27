import { rdfs, schema, sh } from '../../helpers/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings } from '../../types'
import PropertyObject from './PropertyObject'
import { DataFactory } from 'n3'
import { useCallback, useEffect, useState } from 'react'
import { useWidget } from '../../hooks/useWidget'

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

  useEffect(() => {
    if (!widgetMeta) return

    // Add an empty value so an empty widget displays for simple property paths
    if (settings.mode === 'edit' && !dataPointer.executeAll(path).ptrs.length && path.length === 1 && path[0].predicates?.length === 1) {
      const datatype = shaclPointer.out(sh('nodeKind')).term
      if (!datatype || sh('Literal').equals(datatype)) {
        dataPointer.addOut(path[0].predicates[0], widgetMeta.createTerm ? widgetMeta.createTerm() : DataFactory.literal(''))
        setObjectPointers()
      }
    }
  }, [widgetMeta, dataPointer, path, settings.mode, shaclPointer, setObjectPointers])

  // Sometimes the whole of the property can be hidden.
  const shouldShow = !!objectPointers.ptrs.length || settings.mode === 'edit'

  return shouldShow ? (
    <div className="property">
      {label ? <label>{label}</label> : null}
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
