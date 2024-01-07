import { rdfs, schema, sh } from '@centergraph/shared/lib/namespaces'
import { sortPointersByShOrder } from './helpers/sortPointersByShOrder'
import ShaclProperty from './ShaclProperty'

export default function PropertyGroup({ pointer, shapes }: { shapes: GrapoiPointer; pointer: GrapoiPointer }) {
  const id = pointer?.term.value ?? undefined
  const label = pointer?.out([sh('name'), rdfs('label'), schema('name')]).values[0] ?? pointer?.term.id.split(/\/|#/g).pop() ?? 'undefined'
  const shaclProperties = [...shapes.out(sh('property'))].filter((property) => property.out(sh('group')).value === id)

  const items = [...shaclProperties].sort(sortPointersByShOrder).map((pointer) => pointer.term.value)

  return (
    <details className={`shacl-group`}>
      <summary className="title">Group: {label}</summary>

      {items.map((iri) => {
        const shaclProperty = shaclProperties.find((shaclProperty) => shaclProperty.term.value === iri)
        return shaclProperty ? <ShaclProperty key={iri} id={shaclProperty.term.value} pointer={shaclProperty} /> : null
      })}
    </details>
  )
}
