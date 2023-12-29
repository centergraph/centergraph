import { write } from 'npm:@jeswr/pretty-turtle'

import { dataFactory, Quad, Store } from '../deps.ts'

export const writeTurtle = async ({
  store,
  prefixes = {},
}: {
  store: Store
  lists?: Quad[]
  prefixes?: { [key: string]: string }
}): Promise<string> => {
  return await write(
    [...store].map((quad) => dataFactory.quad(quad.subject, quad.predicate, quad.object)),
    { prefixes }
  )
}
