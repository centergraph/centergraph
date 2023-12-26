import { Literal } from '../deps.ts'

/**
 * TODO improve this formatting of the SHACL report item.
 */
export const shaclReportResultToString = (result: any) => {
  const simplePath = result.path[0].predicates[0].value // TODO fix for all the types.
  return `${simplePath}: ${result.message.map((message: Literal) => message.value)}`
}
