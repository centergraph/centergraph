import { FolderAdapter, FileEntry } from '../types.ts'
const ContactShape = Deno.readTextFileSync('./test-data/shapes/contact.shacl.ttl')
const FrankBaker = Deno.readTextFileSync('./test-data/contacts/frank-baker.ttl')

export class TestFolderAdapter implements FolderAdapter {
  public brokenFileEntry1?: FileEntry
  public brokenFileEntry2?: FileEntry

  constructor(brokenFileEntry1?: FileEntry, brokenFileEntry2?: FileEntry) {
    this.brokenFileEntry1 = brokenFileEntry1
    this.brokenFileEntry2 = brokenFileEntry2
  }

  async *iterator(suffix: string) {
    if (this.brokenFileEntry1 && suffix === '.ttl') {
      yield this.brokenFileEntry1
    }

    if (this.brokenFileEntry2 && suffix === '.shacl.ttl') {
      yield this.brokenFileEntry2
    }

    if (suffix.includes('.shacl.ttl') || suffix.includes('.ttl')) {
      yield {
        relativePath: `shapes/contact.shacl`,
        contents: ContactShape,
      } as FileEntry
    }

    if (suffix.includes('.ttl')) {
      yield {
        relativePath: `contacts/frank-baker`,
        contents: FrankBaker,
      } as FileEntry
    }
  }
}
