import { FolderAdapter, FileEntry } from '../FlatFileStore.ts'
import { getFiles } from '../deps.ts'

export class DenoFolderAdapter implements FolderAdapter {
  #folder: string

  constructor(folder: string) {
    this.#folder = folder
  }

  load(): FileEntry[] {
    return getFiles({
      root: this.#folder,
    })
      .filter((file) => file.ext === 'ttl')
      .map((file) => {
        return {
          fullPath: file.path,
          relativePath: file.path.replace(this.#folder + '/', ''),
          get contents() {
            return Deno.readTextFileSync(file.path)
          },
        }
      })
  }
}
