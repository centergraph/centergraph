import { Settings, WidgetProps } from '../../types'
import { sh } from '../../helpers/namespaces'
import { JSXElementConstructor, useEffect, useState } from 'react'
import { getBestWidget } from '../../helpers/getBestWidget'
import { Term } from '@rdfjs/types'

type PropertyObjectProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  setObjectPointers: () => void
}

export default function PropertyObject({ shaclPointer, dataPointer, settings, setObjectPointers }: PropertyObjectProps) {
  const shWidget = settings.mode === 'edit' ? sh('editor') : sh('viewer')
  const widgets = settings.mode === 'edit' ? settings.widgetMetas.editors : settings.widgetMetas.viewers

  const [Widget, setWidget] = useState<JSXElementConstructor<WidgetProps>>()

  useEffect(() => {
    const widgetIri = shaclPointer.out(shWidget).value ?? getBestWidget(widgets, dataPointer, shaclPointer)
    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (widgetModule) widgetModule().then((module) => setWidget(() => module.default))
  }, [dataPointer, settings.widgetLoaders, shWidget, shaclPointer, widgets])

  const [term, realSetTerm] = useState(dataPointer.term)

  const setTerm = (value: Term) => {
    dataPointer = dataPointer.replace(value)
    realSetTerm(value)
    setObjectPointers()
  }

  return Widget ? <Widget dataPointer={dataPointer} term={term} setTerm={setTerm} shaclPointer={shaclPointer} settings={settings} /> : null
}
