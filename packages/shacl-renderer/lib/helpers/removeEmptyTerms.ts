import { DatasetCore } from '@rdfjs/types'

export const removeEmptyTerms = (dataset: DatasetCore) => {
  for (const quad of [...dataset]) {
    /** @ts-expect-error isEmpty is our own property */
    if (quad.object.isEmpty) {
      dataset.delete(quad)
    }
  }
}
