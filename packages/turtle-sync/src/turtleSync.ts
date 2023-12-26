import { Store, ShaclValidator, dataFactory } from './deps.ts'
import { lastPart } from './helpers/lastPart.ts'
import { ffs } from './helpers/namespaces.ts'
import { parseTurtleFile } from './parseTurtleFile.ts'
import { shaclReportResultToString } from './helpers/shaclReportResultToString.ts'
import type { TurtleToStoreOptions } from './types.ts'

export default async function turtleSync(options: TurtleToStoreOptions) {
  const shaclStore = new Store()

  for await (const file of options.folderAdapter.iterator('.shacl.ttl')) {
    const { store, errors } = await parseTurtleFile(file, options.baseIRI)
    if (errors.length) throw new Error(`The SHACL shape ${file.relativePath} could not be parsed.`)
    if (store) shaclStore.addQuads(store.getQuads(null, null, null, null))
  }

  const validator = new ShaclValidator(shaclStore, { factory: dataFactory })
  const indexedErrors: Record<string, Array<string>> = {}

  for await (const file of options.folderAdapter.iterator('.ttl')) {
    const { store, metadata, errors } = await parseTurtleFile(file, options.baseIRI)
    if (errors.length) {
      indexedErrors[file.relativePath] = errors
      continue
    }

    const report = await validator.validate({ dataset: store })

    if (!report.conforms) {
      indexedErrors[file.relativePath] = report.results.flatMap(shaclReportResultToString)
      continue
    }

    if (!errors.length) {
      const [strategyTerm = 'DeleteInsert'] = metadata.getObjects(null, ffs('strategy'), null)
      const strategy = await import(`./strategies/${lastPart(strategyTerm)}.ts`).then((module) => module.default)
      const iri = (options.baseIRI + file.relativePath).replace('/index', '')
      await strategy({ file, graphStore: store, metadata, iri, store: options.store, sparqlEndpoint: options.sparqlEndpoint, fetch })
    }
  }

  return indexedErrors
}
