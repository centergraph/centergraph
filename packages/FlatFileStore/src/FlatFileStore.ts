import { DatasetCore, Quad } from './deps.ts'

export class FlatFileStore extends DatasetCore {
  constructor(quads: Array<Quad> = []) {
    super(quads)
  }
}
