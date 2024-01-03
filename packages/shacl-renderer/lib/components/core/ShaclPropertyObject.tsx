import { Settings } from '@centergraph/shacl-renderer/lib/types'
import { useState } from 'react'
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

export default function ShaclPropertyObject({ shaclPointer, dataPointer, settings, setObjectPointers, path }: PropertyObjectProps) {
  const { Widget, widgetMeta } = useWidget(settings, dataPointer, shaclPointer, true)
  const [term, realSetTerm] = useState(dataPointer.term)
  const { getErrorMessages, reportSignal, validate } = useValidate(settings)

  const errorMessages = getErrorMessages(reportSignal, path)

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
    validate()
  }

  const widgetCssClassName = kebabCase(widgetMeta ? lastPart(widgetMeta.iri) ?? '' : '')

  return (
    <div
      className={`${widgetCssClassName} ${settings.cssClasses.propertyObjectWrapper} ${
        errorMessages.length ? settings.cssClasses.hasErrors : ''
      }`}
    >
      <div className={settings.cssClasses.propertyObject}>
        {/* The widget loads with a Promise */}
        {Widget ? (
          <Widget
            hasErrorsClassName={errorMessages.length ? settings.cssClasses.hasErrors : ''}
            dataPointer={dataPointer}
            term={term}
            setTerm={setTerm}
            shaclPointer={shaclPointer}
            settings={settings}
          />
        ) : (
          <div className={settings.cssClasses.input}></div>
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
            className={settings.cssClasses.button.remove}
          >
            <Icon icon="octicon:trash-16" />
          </button>
        ) : null}
      </div>

      {/* The SHACL errors */}
      {errorMessages.length && settings.mode === 'edit' ? (
        <div className={settings.cssClasses.errorMessage} role="alert">
          {errorMessages.join('\n')}
        </div>
      ) : null}
    </div>
  )
}
