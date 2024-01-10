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

export const denoGlob = async (path: string, options: { eager?: boolean }) => {
  const glob = await import('https://deno.land/std@0.211.0/path/glob.ts')
  const walk = (await import('https://deno.land/std@0.211.0/fs/walk.ts')).walk

  const absoluteGlob = (await import.meta.resolve(path)).replace('file://', '')
  const regexPath = glob.globToRegExp(absoluteGlob)

  const returnObject: { [key: string]: Promise<unknown> } = {}

  for await (const fileEntry of walk(import.meta.resolve('../components/').replace('file://', ''), {
    match: [regexPath],
  })) {
    returnObject[fileEntry.path] = await import(/* @vite-ignore */ fileEntry.path)
  }

  return returnObject
}

export const registerCoreWidgets = async (settings: Settings) => {
  const editorPromises = registerWidgets({
    targetMetas: settings.widgetMetas.editors,
    loaders: settings.widgetLoaders,
    metasGlob: !('Deno' in globalThis)
      ? import.meta.glob('../components/widgets/editors/*/meta.ts', { eager: true })
      : denoGlob('../components/widgets/editors/*/meta.ts', { eager: true }),
    modulesGlob: !('Deno' in globalThis)
      ? import.meta.glob('../components/widgets/editors/*/index.tsx')
      : denoGlob('../components/widgets/editors/*/index.tsx'),
  })

  const viewerPromises = registerWidgets({
    targetMetas: settings.widgetMetas.viewers,
    loaders: settings.widgetLoaders,
    metasGlob: !('Deno' in globalThis)
      ? import.meta.glob('../components/widgets/viewers/*/meta.ts', { eager: true })
      : denoGlob('../components/widgets/viewers/*/meta.ts', { eager: true }),
    modulesGlob: !('Deno' in globalThis)
      ? import.meta.glob('../components/widgets/viewers/*/index.tsx')
      : denoGlob('../components/widgets/viewers/*/index.tsx'),
  })

  Promise.allSettled([...editorPromises, ...viewerPromises])
}
