import { FolderAdapter, FileEntry } from '../FlatFileStore.ts'
const ContactShape = Deno.readTextFileSync('./test-data/shapes/contact.shacl.ttl')

export class TestFolderAdapter implements FolderAdapter {
  load(): FileEntry[] {
    return [
      {
        fullPath: `${Deno.cwd()}/fake-stubs/shapes/contact.shacl`,
        relativePath: `shapes/contact.shacl`,
        contents: ContactShape,
      },
    ]
  }
}
