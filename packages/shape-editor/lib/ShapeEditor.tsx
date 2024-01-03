import Card from './Card'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Wrapper from './Wrapper'
import './style.css'

// https://react-dnd.github.io/react-dnd/docs/tutorial#adding-drag-and-drop-interaction
export default function ShapeEditor() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Wrapper wrapper="1">
          <h3>Wrapper 1</h3>
        </Wrapper>

        <Wrapper wrapper="2">
          <h3>Wrapper 2</h3>
        </Wrapper>

        <Card text={'test'} />
        <Card text={'test1'} />
      </DndProvider>
    </div>
  )
}
