import { Settings } from '../../types'
import { useState } from 'react'
import { Term } from '@rdfjs/types'
import { useWidget } from '../../hooks/useWidget'

type PropertyObjectProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  setObjectPointers: () => void
}

export default function PropertyObject({ shaclPointer, dataPointer, settings, setObjectPointers }: PropertyObjectProps) {
  const { Widget } = useWidget(settings, dataPointer, shaclPointer, true)
  const [term, realSetTerm] = useState(dataPointer.term)

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
  }

  return Widget ? <Widget dataPointer={dataPointer} term={term} setTerm={setTerm} shaclPointer={shaclPointer} settings={settings} /> : null
}
