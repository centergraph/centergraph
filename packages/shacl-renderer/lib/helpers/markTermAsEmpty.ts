import { Term } from '@rdfjs/types'

export const markTermAsEmpty = (term: Term) => {
  term.isEmpty = true
  return term
}
