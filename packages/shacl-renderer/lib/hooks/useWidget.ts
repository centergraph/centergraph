import { JSXElementConstructor, useEffect, useMemo, useState } from 'react'
import { sh } from '@/helpers/namespaces'
import { Settings, WidgetProps } from '@/types'
import { getBestWidget } from '@/helpers/getBestWidget'

export const useWidget = (settings: Settings, dataPointer: GrapoiPointer, shaclPointer: GrapoiPointer, load: boolean = false) => {
  const shWidget = settings.mode === 'edit' ? sh('editor') : sh('viewer')
  const widgets = settings.mode === 'edit' ? settings.widgetMetas.editors : settings.widgetMetas.viewers

  const [Widget, setWidget] = useState<JSXElementConstructor<WidgetProps>>()
  const widgetIri = useMemo(() => {
    return shaclPointer.out(shWidget).value ?? getBestWidget(widgets, dataPointer, shaclPointer)
  }, [dataPointer, shWidget, shaclPointer, widgets])

  useEffect(() => {
    if (!widgetIri || !load) return
    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (widgetModule) widgetModule().then((module) => setWidget(() => module.default))
  }, [dataPointer, settings.widgetLoaders, shWidget, shaclPointer, widgets, load, widgetIri])

  const widgetMeta = widgets.find((widgetMeta) => widgetMeta.iri.value === widgetIri)

  return { widgetIri, Widget, widgetMeta }
}
