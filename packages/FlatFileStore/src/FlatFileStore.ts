import { DatasetCore, Quad } from './deps.ts'
import { fileIterator } from './core/helpers/FileIterator.ts'

export interface FolderAdapter {
  load(folder: string): Promise<Array<{ path: string; contents: Promise<string> }>>
}

export type FlatFileStoreOptions = {
  quads?: Array<Quad>
  folderAdapter?: FolderAdapter
}

export class FlatFileStore extends DatasetCore {
  constructor(options: FlatFileStoreOptions = {}) {
    const { quads } = options
    super(quads)
  }
}

export class DenoFolderAdapter implements FolderAdapter {
  async load(folder: string): Promise<{ path: string; contents: Promise<string> }[]> {
    const iterator = fileIterator(folder)

    return []
  }
}
