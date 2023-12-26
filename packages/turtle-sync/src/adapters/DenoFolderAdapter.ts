import { FolderAdapter, FileEntry } from '../types.ts'
import { walk } from '../deps.ts'

export class DenoFolderAdapter implements FolderAdapter {
  #folder: string

  constructor(folder: string) {
    this.#folder = folder
  }

  async *iterator(suffix: string) {
    for await (const file of walk(this.#folder)) {
      if (!file.name.endsWith(suffix)) continue

      yield {
        relativePath: file.path.replace(this.#folder + '/', '').replace(suffix, ''),
        get contents() {
          return Deno.readTextFileSync(file.path)
        },
      } as FileEntry
    }
  }
}
