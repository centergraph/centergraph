import ReactDOM from 'react-dom/client'
import ShapeNavigation from '../lib/ShapeNavigation'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <ShapeNavigation shaclShapesUrl="/shapes/contact.shacl.ttl" />
)
