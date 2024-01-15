import { sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import { getBestWidget } from '@centergraph/shacl-renderer/lib/helpers/getBestWidget'
import { asResource } from '@centergraph/sdk/lib/asResource'

export const widgetCache = new Map()

const createWidgetPromise = async (
  settings: Settings,
  dataPointer: GrapoiPointer,
  shaclPointer: GrapoiPointer,
  load: boolean = false
) => {
  const shWidget = settings.mode === 'edit' ? sh('editor') : sh('viewer')
  const widgets = settings.mode === 'edit' ? settings.widgetMetas.editors : settings.widgetMetas.viewers
  const widgetIri = shaclPointer.out(shWidget).value ?? getBestWidget(widgets, dataPointer, shaclPointer)
  const widgetMeta = widgets.find((widgetMeta) => widgetMeta.iri.value === widgetIri)
  let Widget = null

  if (load) {
    const widgetModule = settings.widgetLoaders.get(widgetIri)
    if (widgetModule) {
      Widget = (await widgetModule()).default
      widgetCache.set(widgetIri, Widget)
    }
  }

  return {
    widgetIri,
    Widget: Widget ?? widgetCache.get(widgetIri),
    widgetMeta,
  }
}

export const useWidget = (
  settings: Settings,
  dataPointer: GrapoiPointer,
  shaclPointer: GrapoiPointer,
  load: boolean = false
) => {
  const shWidget = settings.mode === 'edit' ? sh('editor') : sh('viewer')
  const widgets = settings.mode === 'edit' ? settings.widgetMetas.editors : settings.widgetMetas.viewers
  const widgetIri = shaclPointer.out(shWidget).value ?? getBestWidget(widgets, dataPointer, shaclPointer)

  return asResource(createWidgetPromise(settings, dataPointer, shaclPointer, load), widgetIri)
}
