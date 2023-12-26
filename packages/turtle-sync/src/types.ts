import { DatasetCore, Store } from './deps.ts'

/**
 * The options for TurtleToStore
 */
export type TurtleToStoreOptions = {
  store?: DatasetCore
  sparqlEndpoint?: string
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

export type StrategyProps = {
  file: FileEntry
  graphStore: Store
  metadata: Store
  iri: string
  sparqlEndpoint: string
  store: Store
}
