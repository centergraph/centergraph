import { ffs, rdf } from './core/helpers/namespaces.ts'
import {
  Store,
  Quad,
  Parser,
  dataFactory,
  percentageWidget,
  amountWidget,
  ProgressBar,
  ShaclValidator,
} from './deps.ts'

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
  disableCLI?: boolean
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

    const files = this.#options.folderAdapter.load()
    if (!this.#options.disableCLI) {
      console.log()
      console.log(`Parsing ${files.length} turtle files`)
    }
    const widgets = [percentageWidget, amountWidget]
    const parseProgressBar = new ProgressBar({ total: files.length, widgets })

    let finished = 0
    const parsePromises: Array<Promise<void>> = files.map(async (file) => {
      const parser = new Parser({
        baseIRI: this.#options.base,
      })
      const quads = await parser.parse(file.contents)
      const transformedQuads = quads.map((quad) => this.transformQuad(quad, file))
      const tempStore = new Store(transformedQuads)
      const [ffsMetaDataSubject] = tempStore.getSubjects(rdf('type'), ffs('MetaData'), null)
      const filteredTransformedQuads = ffsMetaDataSubject
        ? transformedQuads.filter((quad) => !quad.subject.equals(ffsMetaDataSubject))
        : transformedQuads

      const ffsStrategy = tempStore.getObjects(ffsMetaDataSubject, ffs('strategy'), null)
      if (ffsStrategy) {
        console.log(ffsStrategy)
      }

      this.addQuads(filteredTransformedQuads)

      finished++
      if (!this.#options.disableCLI) await parseProgressBar.update(finished)
    })
    if (!this.#options.disableCLI) await parseProgressBar.finish()
    if (!this.#options.disableCLI) console.log()

    await Promise.allSettled(parsePromises)
    finished = 0
    if (!this.#options.disableCLI) console.log(`Validating ${files.length} turtle files`)

    const validateProgressBar = new ProgressBar({ total: files.length, widgets })
    const validator = new ShaclValidator(this, { factory: dataFactory })

    const validatePromises = this.getGraphs(null, null, null).map(async (graph) => {
      const subset = new Store(this.getQuads(null, null, null, graph))
      const report = await validator.validate({ dataset: subset })
      finished++
      if (!this.#options.disableCLI) await validateProgressBar.update(finished)
      return report.conforms
    })

    if (!this.#options.disableCLI) {
      await validateProgressBar.finish()
      console.log()
    }

    const results = await Promise.allSettled(validatePromises)
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
