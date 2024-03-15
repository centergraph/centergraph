import ShaclRenderer from '@/ShaclRenderer'
import ReactDOM from 'react-dom/client'

import { defaultSettings } from '@/defaultSettings'
import { registerCoreWidgets } from '@/helpers/registerWidgets'
import { ReactNode } from 'react'
import { DatasetCore } from '@rdfjs/types'
import factory from '@rdfjs/data-model'

const editSettings = defaultSettings('edit')
registerCoreWidgets(editSettings)

const viewSettings = defaultSettings('view')
registerCoreWidgets(viewSettings)

const blankSettings = defaultSettings('edit')
blankSettings.subjectSelector = (dataset: DatasetCore) => {
  const addresses = dataset.match(
    factory.namedNode('http://example.com/john-doe'),
    factory.namedNode('https://schema.org/address'),
    null
  )
  return [...addresses]?.[0]?.object
}
registerCoreWidgets(blankSettings)

console.log(blankSettings)

const presets: {
  [key: string]: {
    title: string
    element: () => ReactNode
  }
} = {
  'contact-card-form': {
    title: 'Contact card form',
    element: () => (
      <ShaclRenderer
        settings={editSettings}
        shaclShapesUrl="./shapes/contact.shacl.ttl"
        dataUrl="./john-doe.ttl"
        subject="http://example.com/john-doe"
      />
    ),
  },
  'blank-node': {
    title: 'Blank Node pointer',
    element: () => (
      <ShaclRenderer settings={blankSettings} shaclShapesUrl="./shapes/blank.shacl.ttl" dataUrl="./blank.ttl" />
    ),
  },
  'contact-card-form-empty': {
    title: 'Contact card form empty',
    element: () => (
      <ShaclRenderer
        settings={editSettings}
        onSubmit={(dataset, pointer) => {
          console.log([...dataset])
        }}
        shaclShapesUrl="./shapes/contact.shacl.ttl"
      >
        <button className="btn btn-primary">Save</button>
      </ShaclRenderer>
    ),
  },
  'various-widgets-form': {
    title: 'Various widgets form',
    element: () => (
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
    element: () => (
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
    return presets[presetName].element()
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
