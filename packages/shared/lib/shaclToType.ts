import ts from 'typescript'
import { ContextParser } from 'jsonld-context-parser'
import { rdf, sh, sr, xsd } from '@centergraph/shared/lib/namespaces'
import parsePath from 'shacl-engine/lib/parsePath'

export function shaclToType(
  shaclPointer: GrapoiPointer,
  context: { [key: string]: unknown },
  nested: false
): Promise<string>
export function shaclToType(
  shaclPointer: GrapoiPointer,
  context: { [key: string]: unknown },
  nested: true
): Promise<ts.TypeLiteralNode>
export async function shaclToType(
  shaclPointer: GrapoiPointer,
  context: { [key: string]: unknown },
  nested: boolean = false
) {
  const contextParser = new ContextParser()

  let shapePointer = shaclPointer.hasOut(rdf('type'), sh('NodeShape'))
  if (!nested) shapePointer = shapePointer.hasOut(rdf('type'), sr('MainShape'))

  const shaclProperties = [...shapePointer.out(sh('property'))].sort((a, b) => {
    const aOrder = a.out(sh('order')).value ? parseFloat(a.out(sh('order')).value) : 0
    const bOrder = b.out(sh('order')).value ? parseFloat(b.out(sh('order')).value) : 0
    return bOrder - aOrder
  })

  const parsedContext = await contextParser.parse(context)

  const props = []

  for (const shaclProperty of shaclProperties) {
    const path = parsePath(shaclProperty.out(sh('path')))
    if (path.length !== 1 || path[0].predicates.length !== 1) throw new Error('Not yet supported')
    const predicate = path[0].predicates[0]
    const compactedPredicate = parsedContext.compactIri(predicate.value, true)
    const isRequired = !!shaclProperty.out(sh('minCount')).value
    const maxCount =
      (shaclProperty.out(sh('maxCount')).value ? parseInt(shaclProperty.out(sh('maxCount')).value) : Infinity) ??
      Infinity
    const isMultiple = maxCount > 1

    const node = shaclProperty.out(sh('node')).term
    if (node) {
      const nodeShapePointer = shaclPointer.node(node)

      const subType = await shaclToType(nodeShapePointer, context, true)

      props.push(
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(compactedPredicate),
          !isRequired ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          isMultiple ? ts.factory.createArrayTypeNode(subType) : subType
        )
      )
    } else {
      let type: ts.TypeNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)

      if (shaclProperty.out(sh('datatype')).term?.equals(xsd('date'))) {
        type = ts.factory.createTypeReferenceNode('Date')
      }

      props.push(
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(compactedPredicate),
          !isRequired ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          isMultiple ? ts.factory.createArrayTypeNode(type) : type
        )
      )
    }
  }

  if (nested) {
    return ts.factory.createTypeLiteralNode(props)
  }

  const typeName = parsedContext.compactIri(shapePointer.out(sh('targetClass')).value, true)

  const type = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(typeName),
    undefined,
    ts.factory.createTypeLiteralNode(props)
  )

  const nodes = ts.factory.createNodeArray([type])
  const sourceFile = ts.createSourceFile('placeholder.ts', '', ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS)
  const printer = ts.createPrinter()
  return printer.printList(ts.ListFormat.MultiLine, nodes, sourceFile)
}
