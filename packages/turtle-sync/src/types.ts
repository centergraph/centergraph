import { DatasetCore, Store } from './deps.ts'

/**
 * The options for TurtleToStore
 */
export type TurtleToStoreOptions = {
  store?: DatasetCore
  shaclStore?: Store
  sparqlEndpoint?: string
  folderAdapter: FolderAdapter
  baseIRI: string
  fetch?: typeof globalThis.fetch
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
  sparqlEndpoint?: string
  store?: Store
  fetch: typeof globalThis.fetch
}
