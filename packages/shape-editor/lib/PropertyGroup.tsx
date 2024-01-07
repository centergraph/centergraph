import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableShaclProperty from './SortableShaclProperty'
import { sortPointersByShOrder } from './helpers/sortPointersByShOrder'

export default function PropertyGroup({ pointer, shapes }: { shapes: GrapoiPointer; pointer: GrapoiPointer }) {
  const id = pointer?.term.value ?? undefined
  const label = pointer?.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer?.term.id.split(/\/|#/g).pop() ?? 'undefined'
  const shaclProperties = [...shapes.out(sh('property'))].filter((property) => property.out(sh('group')).value === id)

  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ['property'],
      type: 'group',
      pointer,
    },
  })

  const items = [...shaclProperties].sort(sortPointersByShOrder).map((pointer) => pointer.term.value)

  return (
    <details ref={setNodeRef} className={`shacl-group`}>
      <summary className="title">Group: {label}</summary>

      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((iri) => {
          const shaclProperty = shaclProperties.find((shaclProperty) => shaclProperty.term.value === iri)
          return shaclProperty ? <SortableShaclProperty key={iri} id={shaclProperty.term.value} pointer={shaclProperty} /> : null
        })}
      </SortableContext>
    </details>
  )
}
