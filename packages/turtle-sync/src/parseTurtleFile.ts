import { dataFactory, Parser, Quad, Store } from './deps.ts'
import { ts } from './helpers/namespaces.ts'
import type { FileEntry } from './types.ts'

const parse = async (contents: string, baseIRI: string): Promise<{ quads: Quad[]; prefixes: unknown }> => {
  const parser = new Parser({ baseIRI })

  return new Promise((resolve, reject) => {
    const quads: Quad[] = []
    parser.parse(contents, (error, quad, prefixes) => {
      if (error) reject(error)
      if (quad) quads.push(quad)
      if (prefixes) {
        resolve({
          quads,
          prefixes,
        })
      }
    })
  })
}

/**
 * Contains rudimentary text parsing
 */
export const parseTurtleFile = async (file: FileEntry, baseIRI: string) => {
  const errors: Error[] = []
  const metadata = new Store()
  let store: Store | undefined
  const prefixes: { [key: string]: string } = {}

  const fileContents = file.contents

  if (!fileContents.includes('<>'))
    errors.push(new Error('The main subject of a turtle file for use with TurtleToStore must use <> as the subject.'))
  if (fileContents.includes('@base')) errors.push(new Error('@base is not supported with TurtleToStore.'))

  try {
    const specificBaseIRI = (baseIRI + file.relativePath).replace('/index', '')
    const { quads, prefixes: newPrefixes } = await parse(fileContents, specificBaseIRI)
    Object.assign(prefixes, newPrefixes)
    metadata.addQuads(quads.filter((quad) => quad.predicate.value.startsWith(ts().value)))
    const filteredQuads = quads.filter((quad) => !quad.predicate.value.startsWith(ts().value))
    store = new Store(
      filteredQuads.map((quad: Quad) => dataFactory.quad(quad.subject, quad.predicate, quad.object, dataFactory.namedNode(specificBaseIRI)))
    )
  } catch (error) {
    errors.push(error)
  }
  return { metadata, store, prefixes, errors: errors.map((error) => error.message) }
}
