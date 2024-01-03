import { expect, test } from 'vitest'
import { score, createTerm } from './meta'
import { schema, sh, xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { prepareScoreTest } from '@centergraph/shacl-renderer/lib/helpers/prepareTestScore'

test('it scores', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('birthDate'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(10)
})

test('it does not score', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('givenName'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(undefined)
})

test('it does not score', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('birthDate'))

  shaclPointer.deleteOut(sh('datatype'))

  const givenScore = score(dataPointer.node(), shaclPointer)
  expect(givenScore).toBe(undefined)
})

test('it creates a date literal', async () => {
  const term = createTerm()

  expect(term.datatype.value).toBe(xsd('date').value)
})
