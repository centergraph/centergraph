import ShaclRenderer from '@/ShaclRenderer'
import ReactDOM from 'react-dom/client'

import { defaultSettings } from '@/defaultSettings'
import { registerCoreWidgets } from '@/helpers/registerWidgets'
import { ReactNode } from 'react'

const editSettings = defaultSettings('edit')
registerCoreWidgets(editSettings)

const viewSettings = defaultSettings('view')
registerCoreWidgets(viewSettings)

const presets: {
  [key: string]: {
    title: string
    element: ReactNode
  }
} = {
  'contact-card-form': {
    title: 'Contact card form',
    element: (
      <ShaclRenderer
        settings={editSettings}
        shaclShapesUrl="./shapes/contact.shacl.ttl"
        dataUrl="./john-doe.ttl"
        subject="http://example.com/john-doe"
      />
    ),
  },
  'various-widgets-form': {
    title: 'Various widgets form',
    element: (
      <ShaclRenderer
        settings={editSettings}
        shaclShapesUrl="./shapes/various-widgets.shacl.ttl"
        dataUrl="./john-doe.ttl"
        subject="http://example.com/john-doe"
      />
    ),
  },
  'contact-card-view': {
    title: 'Contact card view',
    element: (
      <ShaclRenderer
        settings={viewSettings}
        shaclShapesUrl="./shapes/contact.shacl.ttl"
        dataUrl="./john-doe.ttl"
        subject="http://example.com/john-doe"
      />
    ),
  },
}

export function Main() {
  const presetName = location.pathname.substring(1)

  if (presets[presetName]) {
    return presets[presetName].element
  }

  return (
    <ul>
      {Object.entries(presets).map(([name, preset]) => (
        <li key={name}>
          <a href={`/${name}`}>{preset.title}</a>
        </li>
      ))}
    </ul>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  {
    ReactDOM.createRoot(document.getElementById('app')!).render(<Main />)
  }
})
