import { DenoFolderAdapter } from './adapters/DenoFolderAdapter.ts'
import { Store, ShaclValidator, dataFactory, Literal } from './deps.ts'
import { ffs } from './namespaces.ts'
import { parseTurtleFile } from './parseTurtleFile.ts'
import type { TurtleToStoreOptions } from './types.ts'

/**
 * TODO improve this formatting of the SHACL report item.
 */
export const shaclReportResultToString = (result: any) => {
  const simplePath = result.path[0].predicates[0].value // TODO fix for all the types.
  return `${simplePath}: ${result.message.map((message: Literal) => message.value)}`
}

export default async function turtleSync(options: TurtleToStoreOptions) {
  // TODO create getShaclStore with existing SHACL from the database if using a database.
  // We need all the SHACL shapes in the running memory to be able to do validations.
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

    const strategy = metadata.getObjects(null, ffs('strategy'), null)
    console.log(strategy)
  }

  console.log(indexedErrors)
}

turtleSync({
  store: new Store(),
  baseIRI: 'http://example.com/',
  folderAdapter: new DenoFolderAdapter('test-data'),
})
