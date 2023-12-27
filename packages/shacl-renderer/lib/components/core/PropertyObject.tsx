import { Settings } from '@/types'
import { useState } from 'react'
import { Term } from '@rdfjs/types'
import { useWidget } from '@/hooks/useWidget'
import { Icon } from '@iconify/react'
import { DataFactory } from 'n3'
import { lastPart } from '@/helpers/lastPart'
import { snakeCase } from '@/helpers/snakeCase'

type PropertyObjectProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  setObjectPointers: () => void
}

export default function PropertyObject({ shaclPointer, dataPointer, settings, setObjectPointers }: PropertyObjectProps) {
  const { Widget, widgetMeta } = useWidget(settings, dataPointer, shaclPointer, true)
  const [term, realSetTerm] = useState(dataPointer.term)

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
  }

  const widgetCssClassName = snakeCase(widgetMeta ? lastPart(widgetMeta.iri) ?? '' : '')

  return Widget ? (
    <div className={`${settings.cssClasses.propertyObject} ${widgetCssClassName}`}>
      <Widget dataPointer={dataPointer} term={term} setTerm={setTerm} shaclPointer={shaclPointer} settings={settings} />
      {settings.mode === 'edit' ? (
        <button
          onClick={() => {
            // Removes all quads that are one level deeper
            // TODO improve this logic.
            const quads = [...dataPointer.out().quads()]
            dataPointer.ptrs[0].dataset.removeQuads(quads)

            // Set the current term to a blank one.
            setTerm(widgetMeta?.createTerm ? widgetMeta.createTerm() : DataFactory.literal(''))
          }}
          className={settings.cssClasses.button.remove}
        >
          <Icon icon="octicon:trash-16" />
        </button>
      ) : null}
    </div>
  ) : null
}
