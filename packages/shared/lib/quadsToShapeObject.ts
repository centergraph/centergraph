import { rdf, sh, sr, xsd } from './namespaces'
import parsePath from 'shacl-engine/lib/parsePath'
import { JsonLdContextNormalized } from 'jsonld-context-parser/lib/JsonLdContextNormalized'
import { Term } from '@rdfjs/types'

const mapValue = (term: Term) => {
  if (term.termType === 'Literal') {
    if (term.datatype.equals(xsd('date'))) {
      return new Date(term.value)
    }
  }

  return term.value
}

export const quadsToShapeObject = async (
  shaclPointer: GrapoiPointer,
  dataPointer: GrapoiPointer,
  context: { [key: string]: unknown },
  nested: boolean = false
) => {
  let shapePointer = shaclPointer.hasOut(rdf('type'), sh('NodeShape'))
  if (!nested) shapePointer = shapePointer.hasOut(rdf('type'), sr('MainShape'))

  const shaclProperties = [...shapePointer.out(sh('property'))].sort((a, b) => {
    const aOrder = a.out(sh('order')).value ? parseFloat(a.out(sh('order')).value) : 0
    const bOrder = b.out(sh('order')).value ? parseFloat(b.out(sh('order')).value) : 0
    return bOrder - aOrder
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const returnObject: any = {}
  const parsedContext = new JsonLdContextNormalized(context)

  for (const shaclProperty of shaclProperties) {
    const path = parsePath(shaclProperty.out(sh('path')))
    if (path.length !== 1 || path[0].predicates.length !== 1) throw new Error('Not yet supported')
    const predicate = path[0].predicates[0]
    const compactedPredicate = parsedContext.compactIri(predicate.value, true)
    // const isRequired = !!shaclProperty.out(sh('minCount')).value
    const maxCount =
      (shaclProperty.out(sh('maxCount')).value ? parseInt(shaclProperty.out(sh('maxCount')).value) : Infinity) ??
      Infinity
    const isMultiple = maxCount > 1
    const valuesPointer = dataPointer.executeAll(path)

    const node = shaclProperty.out(sh('node')).term
    if (node) {
      const nodeShapePointer = shaclPointer.node(node)
      const nestedValues = await Promise.all(
        [...valuesPointer].map((valuePointer) => quadsToShapeObject(nodeShapePointer, valuePointer, context, true))
      )

      returnObject[compactedPredicate] = isMultiple ? nestedValues : nestedValues[0]
    } else {
      const mappedValues = [...valuesPointer].map((valuePointer) => mapValue(valuePointer.term))
      returnObject[compactedPredicate] = isMultiple ? mappedValues : mappedValues[0]
    }

    // console.log(isRequired, isMultiple)
  }

  return returnObject
}
