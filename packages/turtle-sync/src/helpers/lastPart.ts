import { Term } from '../deps.ts'

export const lastPart = (input: Term | string) => {
  if (typeof input !== 'string') input = input.value
  return input.split(/\/|#/g).pop()
}
