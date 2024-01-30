import { rdfs, schema, sh, sr } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import ShaclPropertyObject from './ShaclPropertyObject'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useWidget } from '@centergraph/shacl-renderer/lib/hooks/useWidget'
import { Term } from '@rdfjs/types'
import { lastPart } from '@centergraph/shacl-renderer/lib/helpers/lastPart'
import { ensureTerm } from '@centergraph/shacl-renderer/lib/helpers/ensureTerm'
import kebabCase from 'lodash-es/kebabCase'
import { Icon } from '@iconify/react'
import { markTermAsEmpty } from '@centergraph/shacl-renderer/lib/helpers/markTermAsEmpty'

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
    if (!widgetMeta || settings.mode !== 'edit') return
    ensureTerm(path, dataPointer, widgetMeta, setObjectPointers)
  }, [widgetMeta, dataPointer, path, settings, shaclPointer, setObjectPointers])

  const alternativePredicates = path[0].predicates
  const maxCount = shaclPointer.out(sh('maxCount')).value ? parseInt(shaclPointer.out(sh('maxCount')).value) : Infinity
  const required = shaclPointer.out(sh('minCount')).value ? !!parseInt(shaclPointer.out(sh('minCount')).value) : false

  // Sometimes the whole of the property can be hidden.
  const shouldShow =
    (widgetMeta && (!!objectPointers.ptrs.length || settings.mode === 'edit')) ||
    (settings.mode === 'view' && !!objectPointers.ptrs.length)

  const propertyCssClassName = path[0]?.predicates?.[0] ? kebabCase(lastPart(path[0]?.predicates?.[0]) ?? '') : ''

  const shaclCssClasses = shaclPointer.out(sr('class')).values.join(' ')

  const cssClasses = `${settings.cssClasses[settings.mode].shaclProperty} ${shaclCssClasses} ${
    label ? 'has-label' : ''
  }`
    .replace('[ID]', propertyCssClassName)
    .trim()

  const wrapper = (children: ReactNode) => (cssClasses ? <div className={cssClasses}>{children}</div> : <>{children}</>)

  console.log(required)

  return shouldShow
    ? wrapper(
        <>
          {/* The label of the field */}
          {label ? (
            <label className={settings.cssClasses[settings.mode].label}>
              {label}
              {settings.mode === 'edit' && required ? <span className="required"> *</span> : null}
              {settings.mode === 'view' ? ': ' : null}
            </label>
          ) : null}

          {/* Alternative predicates like schema:name | rdfs:label */}
          {alternativePredicates?.length > 1 && [...objectPointers].length < maxCount
            ? alternativePredicates.map((predicate: Term) => (
                <button
                  onClick={() => {
                    dataPointer.addOut(predicate, markTermAsEmpty(widgetMeta!.createTerm!()))
                    setObjectPointers()
                  }}
                  className={settings.cssClasses[settings.mode].button.secondary}
                  key={predicate.value}
                  title={predicate.value}
                >
                  + {lastPart(predicate)}
                </button>
              ))
            : null}

          {/* The rendering of the widget happens inside the ShaclPropertyObject */}
          {[...objectPointers].map((objectPointer, index) => (
            <ShaclPropertyObject
              path={path}
              key={JSON.stringify(path) + index} // TODO get the shortest representation of the path.
              setObjectPointers={setObjectPointers}
              dataPointer={objectPointer}
              shaclPointer={shaclPointer}
              settings={settings}
            />
          ))}

          {settings.mode === 'edit' && maxCount > [...objectPointers].length ? (
            <button
              type="button"
              onClick={() => {
                dataPointer.addOut([path[0].predicates[0]], [markTermAsEmpty(widgetMeta!.createTerm!())])
                setObjectPointers()
              }}
              className={settings.cssClasses[settings.mode].button.add}
            >
              <Icon icon="octicon:plus-16" />
            </button>
          ) : null}
        </>
      )
    : null
}
