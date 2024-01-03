import { ReactElement } from 'react'
import { Settings, WidgetMeta } from '@centergraph/shacl-renderer/lib/types'

export type LoadWidgetsProps = {
  targetMetas: Array<WidgetMeta>
  loaders: Map<string, () => Promise<{ default: ReactElement }>>
  metasGlob: Record<string, WidgetMeta>
  modulesGlob: Record<string, () => Promise<unknown>>
}

export const registerWidgets = ({ targetMetas, loaders, metasGlob, modulesGlob }: LoadWidgetsProps) => {
  return Object.entries(metasGlob).map(([path, meta]) => {
    const pathParts = path.split('/')
    pathParts.pop()
    const pathPrefix = pathParts.join('/')

    const module = Object.entries(modulesGlob).find(([path]) => path.startsWith(pathPrefix))
    loaders.set(meta.iri.value, module?.[1] as unknown as () => Promise<{ default: ReactElement }>)
    targetMetas.push(meta)
  })
}

export const registerCoreWidgets = async (settings: Settings) => {
  const editorPromises = registerWidgets({
    targetMetas: settings.widgetMetas.editors,
    loaders: settings.widgetLoaders,
    metasGlob: import.meta.glob('../components/widgets/editors/*/meta.ts', { eager: true }),
    modulesGlob: import.meta.glob('../components/widgets/editors/*/index.tsx'),
  })

  const viewerPromises = registerWidgets({
    targetMetas: settings.widgetMetas.viewers,
    loaders: settings.widgetLoaders,
    metasGlob: import.meta.glob('../components/widgets/viewers/*/meta.ts', { eager: true }),
    modulesGlob: import.meta.glob('../components/widgets/viewers/*/index.tsx'),
  })

  Promise.allSettled([...editorPromises, ...viewerPromises])
}
