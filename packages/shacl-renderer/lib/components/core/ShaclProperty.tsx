import { rdfs, schema, sh } from '../../helpers/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings } from '../../types'
import { JSXElementConstructor, useEffect, useState } from 'react'
import { getBestWidget } from '../../helpers/getBestWidget'

type ShaclPropertyProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
}

export default function ShaclProperty({ shaclPointer, dataPointer, settings }: ShaclPropertyProps) {
  const path = parsePath(shaclPointer.out(sh('path')))
  const label = shaclPointer.out([rdfs('label'), sh('name'), schema('name')]).values?.[0]
  const shWidget = settings.mode === 'edit' ? sh('editor') : sh('viewer')
  const widgets = settings.mode === 'edit' ? settings.widgetMetas.editors : settings.widgetMetas.viewers

  const [Widget, setWidget] = useState<JSXElementConstructor<unknown>>()

  useEffect(() => {
    const widgetIri = shaclPointer.out(shWidget).value ?? getBestWidget(widgets, shaclPointer, dataPointer)
    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (widgetModule) widgetModule().then((module) => setWidget(() => module.default))
  }, [dataPointer, settings.widgetLoaders, shWidget, shaclPointer, widgets])

  return (
    <div className="property">
      {label ? <h3>{label}</h3> : null}
      {Widget ? <Widget /> : `...`}
    </div>
  )
}
