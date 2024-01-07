import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ShaclProperty } from './ShaclProperty'

type ShaclPropertyProps = {
  pointer: GrapoiPointer
  id: string
  isDragging?: boolean
}

export default function SortableShaclProperty({ pointer }: ShaclPropertyProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: pointer.term.value,
    data: {
      type: 'property',
      pointer,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return <ShaclProperty id={pointer.term.value} pointer={pointer} ref={setNodeRef} style={style} {...attributes} {...listeners} />
}
