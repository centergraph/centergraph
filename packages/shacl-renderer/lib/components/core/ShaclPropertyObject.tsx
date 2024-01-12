import { Settings } from '@centergraph/shacl-renderer/lib/types'
import { ReactNode, useState } from 'react'
import { Term } from '@rdfjs/types'
import { useWidget } from '@centergraph/shacl-renderer/lib/hooks/useWidget'
import { Icon } from '@iconify/react'
import { lastPart } from '@centergraph/shacl-renderer/lib/helpers/lastPart'
import kebabCase from 'lodash-es/kebabCase'
import { useValidate } from '@centergraph/shacl-renderer/lib/hooks/useValidate'

type PropertyObjectProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  path: unknown
  setObjectPointers: () => void
}

export default function ShaclPropertyObject({
  shaclPointer,
  dataPointer,
  settings,
  setObjectPointers,
  path,
}: PropertyObjectProps) {
  const { Widget, widgetMeta } = useWidget(settings, dataPointer, shaclPointer, true)
  const [term, realSetTerm] = useState(dataPointer.term)
  const { getErrorMessages, reportSignal, validate } = useValidate()

  // TODO how to deal with the required state?
  const errorMessages = !term.isEmpty ? getErrorMessages(reportSignal, path) : []

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
    validate()
  }

  const widgetCssClassName = kebabCase(widgetMeta ? lastPart(widgetMeta.iri) ?? '' : '')
  const cssClasses = settings.cssClasses[settings.mode].propertyObjectWrapper.replace('[ID]', widgetCssClassName)

  const wrapper = (children: ReactNode) => (cssClasses ? <div className={cssClasses}>{children}</div> : <>{children}</>)

  const innerCssClasses = settings.cssClasses[settings.mode].propertyObject
  const inner = (children: ReactNode) =>
    innerCssClasses ? <div className={innerCssClasses}>{children}</div> : <>{children}</>

  return wrapper(
    <>
      {inner(
        <>
          {/* The widget loads with a Promise */}
          {Widget ? (
            <Widget
              hasErrorsClassName={errorMessages.length ? settings.cssClasses[settings.mode].hasErrors : ''}
              dataPointer={dataPointer}
              term={term}
              setTerm={setTerm}
              shaclPointer={shaclPointer}
              settings={settings}
            />
          ) : (
            <div className={settings.cssClasses[settings.mode].input}></div>
          )}
          {settings.mode === 'edit' ? (
            <button
              onClick={() => {
                // Removes all quads that are one level deeper
                // TODO improve this logic.
                const quads = [...dataPointer.quads(), ...dataPointer.out().quads()]
                for (const quad of quads) dataPointer.ptrs[0].dataset.delete(quad)
                setObjectPointers()
              }}
              className={settings.cssClasses[settings.mode].button.remove}
            >
              <Icon icon="octicon:trash-16" />
            </button>
          ) : null}
        </>
      )}

      {/* The SHACL errors */}
      {errorMessages.length && settings.mode === 'edit' ? (
        <div className={settings.cssClasses[settings.mode].errorMessage} role="alert">
          {errorMessages.join('\n')}
        </div>
      ) : null}
    </>
  )
}
