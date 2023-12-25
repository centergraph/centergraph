import { Store, Quad, Parser, dataFactory } from './deps.ts'

export interface FolderAdapter {
  load(): Array<FileEntry>
}

export type FileEntry = {
  relativePath: string
  fullPath: string
  contents: string
}

export type FlatFileStoreOptions = {
  quads?: Array<Quad>
  folderAdapter?: FolderAdapter
  base?: string
  removeExtensions?: boolean
}

export class FlatFileStore extends Store {
  #options: FlatFileStoreOptions
  #ready: boolean = false

  constructor(options: FlatFileStoreOptions = {}) {
    const { quads } = options
    super(quads)
    this.#options = options

    if (this.#options.folderAdapter) {
      this.parseData().then(() => {
        this.#ready = true
      })
    } else {
      this.#ready = true
    }
  }

  async parseData() {
    if (!this.#options.folderAdapter) return
    const parser = new Parser()

    const files = this.#options.folderAdapter.load()

    const promises = files.map(async (file) => {
      const quads = await parser.parse(file.contents)
      const transformedQuads = quads.map((quad) => this.transformQuad(quad, file))
      this.addQuads(transformedQuads)
    })

    return Promise.allSettled(promises)
  }

  transformQuad(quad: Quad, file: FileEntry) {
    const cleanedRelativePath = file.relativePath.replace(
      this.#options.removeExtensions ? '.ttl' : '',
      ''
    )

    const cleanedRelativePathParts = cleanedRelativePath.split('/')
    cleanedRelativePathParts.pop()

    const identifier = cleanedRelativePath.endsWith('index')
      ? cleanedRelativePathParts.join('/') + '/'
      : cleanedRelativePath
    const graph = dataFactory.namedNode((this.#options.base ?? '') + identifier)
    return dataFactory.quad(quad.subject, quad.predicate, quad.object, graph)
  }

  get ready() {
    if (this.#ready) return Promise.resolve(true)

    return new Promise((resolve) => {
      setTimeout(() => resolve(this.ready), 5)
    })
  }
}
