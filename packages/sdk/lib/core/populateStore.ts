import { Parser, DataFactory } from 'n3'
import { DatasetCore } from '@rdfjs/types'

export const populateStore = async (store: DatasetCore) => {
  try {
    const cache = await caches.open('api')
    const cachedFiles = await cache.keys()
    const promises = cachedFiles.map(async (request) => {
      const response = await cache.match(request).then((response) => response?.text())
      if (response) {
        const parser = new Parser({
          baseIRI: request.url,
        })
        const quads = parser.parse(response)
        for (const quad of quads) store.add(DataFactory.quad(quad.subject, quad.predicate, quad.object, DataFactory.namedNode(request.url)))
      }
    })

    await Promise.all(promises)
  } catch (error) {
    // This will not work in a private session
  }
}
