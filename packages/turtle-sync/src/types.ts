import { DatasetCore } from './deps.ts'

/**
 * The options for TurtleToStore
 */
export type TurtleToStoreOptions = (
  | {
      store: DatasetCore
    }
  | {
      sparqlEndpoint: string
    }
) & {
  folderAdapter: FolderAdapter
  baseIRI: string
}

export interface FolderAdapter {
  iterator(suffix: string): AsyncIterable<FileEntry>
}

export type FileEntry = {
  relativePath: string
  contents: string
}
