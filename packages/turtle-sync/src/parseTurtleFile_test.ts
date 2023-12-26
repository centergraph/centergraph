import { assertEquals } from './deps.ts'
import { ex } from './helpers/namespaces.ts'
import { parseTurtleFile } from './parseTurtleFile.ts'

Deno.test('Parse broken turtle file', async () => {
  try {
    await parseTurtleFile(
      {
        relativePath: '',
        contents: '',
      },
      ex('john').value
    )
  } catch (error) {
    assertEquals(error.message, 'The main subject of a turtle file for use with TurtleToStore must use <> as the subject.')
  }
})

Deno.test('Parse turtle file with @base', async () => {
  try {
    await parseTurtleFile(
      {
        relativePath: '',
        contents: '@base <>',
      },
      ex('john').value
    )
  } catch (error) {
    assertEquals(error.message, '@base is not supported with TurtleToStore.')
  }
})
