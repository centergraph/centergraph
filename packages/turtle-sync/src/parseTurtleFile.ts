import { Store, Parser } from './deps.ts'
import { ffs } from './helpers/namespaces.ts'
import type { FileEntry } from './types.ts'

/**
 * Contains rudimentary parsing
 */
export const parseTurtleFile = async (file: FileEntry, baseIRI: string) => {
  const errors: Array<Error> = []
  const metadata = new Store()
  let store: Store | undefined

  const fileContents = file.contents

  if (!fileContents.includes('<>'))
    errors.push(new Error('The main subject of a turtle file for use with TurtleToStore must use <> as the subject.'))
  if (fileContents.includes('@base')) errors.push(new Error('@base is not supported with TurtleToStore.'))

  try {
    const specificBaseIRI = (baseIRI + file.relativePath).replace('/index', '')
    const parser = new Parser({ baseIRI: specificBaseIRI })
    const quads = await parser.parse(fileContents)
    metadata.addQuads(quads.filter((quad) => quad.predicate.value.startsWith(ffs().value)))
    const filteredQuads = quads.filter((quad) => !quad.predicate.value.startsWith(ffs().value))
    store = new Store(filteredQuads)
  } catch (error) {
    errors.push(error)
  }
  return { metadata, store, errors: errors.map((error) => error.message) }
}
