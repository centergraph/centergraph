import { Settings } from '@/types'
import { useState } from 'react'
import { Term } from '@rdfjs/types'
import { useWidget } from '@/hooks/useWidget'
import { Icon } from '@iconify/react'
import { lastPart } from '@/helpers/lastPart'
import { snakeCase } from '@/helpers/snakeCase'
import { useValidate } from '@/hooks/useValidate'
import * as _ from 'lodash-es'

type PropertyObjectProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  path: any
  setObjectPointers: () => void
}

export default function PropertyObject({ shaclPointer, dataPointer, settings, setObjectPointers, path }: PropertyObjectProps) {
  const { Widget, widgetMeta } = useWidget(settings, dataPointer, shaclPointer, true)
  const [term, realSetTerm] = useState(dataPointer.term)
  const { report, validate } = useValidate()

  const errors = report?.results?.filter((result: { path: unknown }) => _.isEqual(result.path, path)) ?? []
  const errorMessages = errors.flatMap((error: { message: Array<Term> }) => error.message.flatMap((message: Term) => message.value))

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
    validate()
  }

  const widgetCssClassName = snakeCase(widgetMeta ? lastPart(widgetMeta.iri) ?? '' : '')

  return (
    <div className={`${widgetCssClassName} ${errorMessages.length ? settings.cssClasses.hasErrors : ''}`}>
      <div className={settings.cssClasses.propertyObject}>
        {/* The widget loads with a Promise */}
        {Widget ? (
          <Widget
            className={errorMessages.length ? settings.cssClasses.hasErrors : ''}
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
              const quads = [...dataPointer.out().quads()]
              dataPointer.ptrs[0].dataset.removeQuads(quads)

              // Set the current term to a blank one.
              setTerm(widgetMeta!.createTerm!())
            }}
            className={settings.cssClasses.button.remove}
          >
            <Icon icon="octicon:trash-16" />
          </button>
        ) : null}
      </div>

      {/* The SHACL errors */}
      {errorMessages.length ? (
        <div className={settings.cssClasses.errorMessage} role="alert">
          {errorMessages.join('\n')}
        </div>
      ) : null}
    </div>
  )
}
