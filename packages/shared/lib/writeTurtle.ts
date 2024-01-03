import { write } from '@jeswr/pretty-turtle'

import { DataFactory, Quad, Store } from 'n3'

export const writeTurtle = async ({
  store,
  prefixes = {},
}: {
  store: Store
  lists?: Quad[]
  prefixes?: { [key: string]: string }
}): Promise<string> => {
  return await write(
    [...store].map((quad) => DataFactory.quad(quad.subject, quad.predicate, quad.object)),
    { prefixes }
  )
}
