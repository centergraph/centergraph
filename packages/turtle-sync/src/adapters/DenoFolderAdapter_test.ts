import { assertEquals } from '../deps.ts'
import { DenoFolderAdapter } from './DenoFolderAdapter.ts'
const ShapesIndex = Deno.readTextFileSync('./test-data/shapes/index.ttl')

Deno.test('Iterate over the folder', async () => {
  const folderAdapter = new DenoFolderAdapter('test-data')

  const paths = []

  for await (const fileEntry of folderAdapter.iterator('.ttl')) {
    paths.push(fileEntry.relativePath)

    if (fileEntry.relativePath === 'shapes/index') {
      assertEquals(fileEntry.contents, ShapesIndex)
    }
  }

  assertEquals(
    [
      'shapes/contact.shacl',
      'shapes/index',
      'contacts/frank-baker',
      'contacts/eddy-invalid',
      'contacts/bob-deleted',
      'contacts/corne-ensure',
      'contacts/john-doe',
    ],
    paths
  )
})
