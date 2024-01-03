import { useEffect, useState } from 'react'
import ShaclRenderer, { ShaclRendererProps } from '@centergraph/shacl-renderer'
import '@centergraph/shacl-renderer/lib/style.css'

type ViewProps = {
  viewMode: string
  url: string
  shaclUrlPromise: Promise<string>
  settings: ShaclRendererProps['settings']
}

export default function View({ url, shaclUrlPromise, settings }: ViewProps) {
  const [shaclUrl, setShaclUrl] = useState('')

  useEffect(() => {
    Promise.all([shaclUrlPromise.then(setShaclUrl)])
  }, [shaclUrlPromise])

  return shaclUrl ? <ShaclRenderer settings={settings} shaclShapesUrl={shaclUrl} dataUrl={url}></ShaclRenderer> : null
}
