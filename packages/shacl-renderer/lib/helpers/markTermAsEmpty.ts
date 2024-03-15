import { Term } from '@rdfjs/types'

export const markTermAsEmpty = (term: Term) => {
  /** @ts-expect-error isEmpty is our own property */
  term.isEmpty = true
  return term
}
