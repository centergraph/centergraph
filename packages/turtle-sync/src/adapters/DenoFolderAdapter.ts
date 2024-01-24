import fs from 'fs'
import path from 'path'

import { FileEntry, FolderAdapter } from '../types.ts'

async function* walk(dir: string): AsyncGenerator<{ path: string; name: string }> {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name)
    if (d.isDirectory()) yield* walk(entry)
    else if (d.isFile())
      yield {
        path: entry,
        name: dir + '/' + d.name,
      }
  }
}

export class DenoFolderAdapter implements FolderAdapter {
  #folder: string

  constructor(folder: string) {
    this.#folder = folder
  }

  async *iterator(suffix: string) {
    for await (const file of walk(this.#folder)) {
      if (!file.name.endsWith(suffix)) continue

      const relativePath = file.name.replace(this.#folder + '/', '').replace(suffix, '')

      console.log(relativePath)

      yield {
        relativePath,
        get contents() {
          return fs.readFileSync(file.path, 'utf-8')
        },
      } as FileEntry
    }
  }
}
