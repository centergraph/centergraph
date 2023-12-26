import { rdfs, schema, sh } from '../../helpers/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings } from '../../types'
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from 'react'

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

  const [Widget, setWidget] = useState<JSXElementConstructor<any>>()

  useEffect(() => {
    let widgetIri = shaclPointer.out(shWidget).value

    if (!widgetIri) {
      const widgetMatches = widgets
        .map((widgetMeta) => ({
          iri: widgetMeta.iri,
          score: widgetMeta.score(shaclPointer, dataPointer),
        }))
        .sort((a, b) => a.score - b.score)

      widgetIri = widgetMatches[0].iri.value
    }

    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (widgetModule)
      widgetModule().then((module) => {
        setWidget(() => module.default)
      })
  }, [])

  return (
    <div className="property">
      {label ? <h3>{label}</h3> : null}
      {Widget ? <Widget /> : `Loading...`}
    </div>
  )
}
