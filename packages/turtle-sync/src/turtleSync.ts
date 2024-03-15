import { dataFactory, Parser, ShaclValidator, Store, Term } from './deps.ts'
import { lastPart } from './helpers/lastPart.ts'
import { rdf, sh, ts } from './helpers/namespaces.ts'
import { shaclReportResultToString } from './helpers/shaclReportResultToString.ts'
import { parseTurtleFile } from './parseTurtleFile.ts'
import type { TurtleToStoreOptions } from './types.ts'

export default async function turtleSync(options: TurtleToStoreOptions) {
  const shaclStore = options.shaclStore ?? new Store()
  const prefixes: { [key: string]: string } = {}
  const shapeClassMap: Map<string, Term[]> = new Map()

  if (options.sparqlEndpoint) {
    const fetch = options.fetch ?? globalThis.fetch
    const response = await fetch(options.sparqlEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/sparql-query' },
      body: `
        SELECT DISTINCT ?g WHERE {
          GRAPH ?g {
          ?s a <http://www.w3.org/ns/shacl#NodeShape> .
          }
        }
      `,
    }).then((response) => response.json())

    const graphIris = response.results.bindings.map((binding: any) => binding.g.value)

    for (const graphIri of graphIris) {
      const fetchQuery = `
        CONSTRUCT {
          ?s ?p ?o
        } WHERE {
          GRAPH <${graphIri}> { ?s ?p ?o }  
        }
      `

      const shapes = await fetch(options.sparqlEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/sparql-query' },
        body: fetchQuery,
      }).then((response) => response.text())

      const parser = new Parser()
      const quads = await parser.parse(shapes)
      shaclStore.addQuads(
        quads.map((quad) =>
          dataFactory.quad(quad.subject, quad.predicate, quad.object, dataFactory.namedNode(graphIri))
        )
      )
    }
  }

  for await (const file of options.folderAdapter.iterator('.shacl.ttl')) {
    const { store, errors } = await parseTurtleFile(file, options.baseIRI)
    if (errors.length) throw new Error(`The SHACL shape ${file.relativePath} could not be parsed.`)
    if (store) shaclStore.addQuads(store.getQuads(null, null, null, null))
    const storeClassQuads = store.getQuads(null, sh('targetClass'), null, null)

    for (const storeClassQuad of storeClassQuads) {
      const targetClass = storeClassQuad.object.value
      if (!shapeClassMap.has(targetClass)) shapeClassMap.set(targetClass, [])
      const targetClassShapeSubjects = shapeClassMap.get(targetClass)
      targetClassShapeSubjects.push(storeClassQuad.subject)
    }
  }

  const validator = new ShaclValidator(shaclStore, { factory: dataFactory })
  const indexedErrors: Record<string, string[]> = {}

  for await (const file of options.folderAdapter.iterator('.ttl')) {
    // TODO this is not very clean. The iterator cuts of the extension.
    if (file.relativePath.endsWith('.shacl')) continue

    const { store, metadata, errors, prefixes: newPrefixes } = await parseTurtleFile(file, options.baseIRI)
    Object.assign(prefixes, newPrefixes)

    if (errors.length) {
      indexedErrors[file.relativePath] = errors
      continue
    }

    const rdfClass = store.getQuads(dataFactory.namedNode(options.baseIRI + file.relativePath), rdf('type'), null, null)

    if (rdfClass.length > 1) throw new Error('Found a turtle file with multiple subjects')
    const report = await validator.validate({ dataset: store }, [{ terms: rdfClass }])

    if (!report.conforms) {
      indexedErrors[file.relativePath] = report.results.flatMap(shaclReportResultToString)
      continue
    }

    if (!errors.length) {
      const [strategyTerm = 'DeleteInsert'] = metadata.getObjects(null, ts('strategy'), null)
      const strategy = await import(`./strategies/${lastPart(strategyTerm)}.ts`).then((module) => module.default)
      const iri = (options.baseIRI + file.relativePath).replace('/index', '')
      await strategy({
        file,
        graphStore: store,
        metadata,
        iri,
        store: options.store,
        sparqlEndpoint: options.sparqlEndpoint,
        fetch,
      })
    }
  }

  return {
    indexedErrors,
    prefixes,
  }
}
