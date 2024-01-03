import ShaclRenderer from '@/ShaclRenderer'
import ReactDOM from 'react-dom/client'

import { defaultSettings } from '@/defaultSettings'
import { registerCoreWidgets } from '@/helpers/registerWidgets'

const settings = defaultSettings('edit')
registerCoreWidgets(settings)

const settings2 = defaultSettings('view')
registerCoreWidgets(settings2)

ReactDOM.createRoot(document.getElementById('app')!).render(
  <>
    <ShaclRenderer
      settings={settings}
      shaclShapesUrl="./shapes/contact.shacl.ttl"
      dataUrl="./john-doe.ttl"
      subject="http://example.com/john-doe"
    />

    <ShaclRenderer
      settings={settings2}
      shaclShapesUrl="./shapes/contact.shacl.ttl"
      dataUrl="./john-doe.ttl"
      subject="http://example.com/john-doe"
    />
  </>
)
