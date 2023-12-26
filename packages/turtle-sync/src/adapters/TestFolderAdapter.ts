import { FolderAdapter, FileEntry } from '../types.ts'
const ContactShape = Deno.readTextFileSync('./test-data/shapes/contact.shacl.ttl')
const FrankBaker = Deno.readTextFileSync('./test-data/contacts/frank-baker.ttl')

export class TestFolderAdapter implements FolderAdapter {
  async *iterator(suffix: string) {
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
